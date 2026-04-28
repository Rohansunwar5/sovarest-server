import { customAlphabet } from 'nanoid';
import { BadRequestError } from '../errors/bad-request.error';
import { CartRepository } from '../repository/cart.repository';
import { OrderRepository } from '../repository/order.repository';
import { ProductVariantRepository } from '../repository/productVariant.repository';
import { guestCartCacheManager, IGuestCartItem } from './cache/entities';
import { IOrderItem, IShippingAddress } from '../models/order.model';
import { ICartCoupon } from '../models/cart.model';
import { createRazorpayOrder } from '../utils/razorpay.util';
import couponService from './coupon.service';
import config from '../config';
import mongoose from 'mongoose';
import { getEffectivePrice } from '../utils/flash-sale.util';

const generateOrderId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

interface ICheckoutActor {
  userId?: string;
  sessionId: string;
}

interface ICheckoutBody {
  shippingAddress: IShippingAddress;
  customerEmail: string;
  guestInfo?: { name: string; email: string; phone: string };
}

class CheckoutService {
  constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _variantRepository: ProductVariantRepository,
    private readonly _orderRepository: OrderRepository,
  ) {}

  async initiateCheckout(actor: ICheckoutActor, body: ICheckoutBody) {
    if (!actor.userId && !body.guestInfo)
      throw new BadRequestError('Guest checkout requires name, email, and phone');

    const rawItems = await this._getCartItems(actor);
    if (!rawItems.length) throw new BadRequestError('Cart is empty');

    const cartCoupon = await this._getCartCoupon(actor);

    // Re-validate prices
    const variantIds = rawItems.map(i => i.variantId);
    const liveVariants = await this._variantRepository.findByIds(variantIds);
    const liveVariantMap = new Map(liveVariants.map(v => [v._id.toString(), v]));

    const orderItems: IOrderItem[] = [];
    for (const item of rawItems) {
      const liveVariant = liveVariantMap.get(item.variantId);
      if (!liveVariant || !liveVariant.isActive)
        throw new BadRequestError(`A product in your cart is no longer available. Please review your cart.`);
      if (liveVariant.stock < item.qty)
        throw new BadRequestError(`Insufficient stock for "${item.productName}". Only ${liveVariant.stock} left.`);

      const checkoutPrice = getEffectivePrice(liveVariant);
      orderItems.push({
        variantId: new mongoose.Types.ObjectId(item.variantId),
        productId: new mongoose.Types.ObjectId(item.productId),
        sku: item.sku,
        productName: item.productName,
        attributeLabels: item.attributeLabels,
        image: item.image,
        qty: item.qty,
        priceAtPurchase: checkoutPrice.price,
        originalPriceAtPurchase: checkoutPrice.originalPrice,
      });
    }

    const subtotal = orderItems.reduce((sum, i) => sum + i.priceAtPurchase * i.qty, 0);

    // Re-validate and recompute coupon
    let couponDiscount = 0;
    let couponCode: string | null = null;
    let couponId: string | null = null;

    if (cartCoupon) {
      const cartItemsForValidation = rawItems.map(i => ({ productId: i.productId }));
      const { coupon, discountAmount } = await couponService.validateAndComputeDiscount({
        code: cartCoupon.code,
        cartSubtotal: subtotal,
        cartItems: cartItemsForValidation,
        userId: actor.userId,
      });
      couponDiscount = discountAmount;
      couponCode = coupon.code;
      couponId = coupon._id.toString();
    }

    // Compute shipping + tax
    const discountedSubtotal = subtotal - couponDiscount;
    const shippingCharge = discountedSubtotal >= config.FREE_SHIPPING_THRESHOLD ? 0 : config.STANDARD_SHIPPING_CHARGE;
    const shippingTax = Math.round(shippingCharge * config.SHIPPING_TAX_RATE);
    const total = discountedSubtotal + shippingCharge + shippingTax;

    // Create Razorpay order
    const orderId = `SOV-${generateOrderId()}`;
    const razorpayOrder = await createRazorpayOrder({
      amountInPaise: Math.round(total * 100),
      receipt: orderId,
      notes: { orderId },
    });

    // Persist Order document
    await this._orderRepository.create({
      orderId,
      userId: actor.userId ?? null,
      customerEmail: body.customerEmail,
      guestInfo: body.guestInfo ?? null,
      sessionId: actor.userId ? null : actor.sessionId,
      items: orderItems,
      shippingAddress: body.shippingAddress,
      billing: {
        subtotal,
        couponCode,
        couponDiscount,
        shippingCharge,
        shippingTax,
        total,
      },
      couponId,
      payment: {
        gateway: 'razorpay',
        razorpayOrderId: razorpayOrder.id,
        razorpayPaymentId: null,
        razorpaySignature: null,
        status: 'pending',
        method: null,
        paidAt: null,
      },
    });

    return {
      orderId,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: config.RAZORPAY_KEY_ID,
      amount: total,
      amountInPaise: Math.round(total * 100),
      currency: 'INR',
    };
  }

  private async _getCartItems(actor: ICheckoutActor): Promise<IGuestCartItem[]> {
    if (actor.userId) {
      const cart = await this._cartRepository.findByUserId(actor.userId);
      if (!cart?.items.length) return [];
      return cart.items.map(i => ({
        variantId: i.variantId.toString(),
        productId: i.productId.toString(),
        productName: i.productName,
        productSlug: i.productSlug,
        sku: i.sku,
        image: i.image,
        attributeLabels: i.attributeLabels,
        priceSnapshot: i.priceSnapshot,
        originalPriceSnapshot: i.originalPriceSnapshot,
        qty: i.qty,
      }));
    }
    const guestCart = await guestCartCacheManager.get({ sessionId: actor.sessionId });
    return guestCart?.items ?? [];
  }

  private async _getCartCoupon(actor: ICheckoutActor): Promise<ICartCoupon | { code: string; discountAmount: number; couponId: string } | null> {
    if (actor.userId) {
      const cart = await this._cartRepository.findByUserId(actor.userId);
      return cart?.coupon ?? null;
    }
    const guestCart = await guestCartCacheManager.get({ sessionId: actor.sessionId });
    return guestCart?.coupon ?? null;
  }
}

export default new CheckoutService(
  new CartRepository(),
  new ProductVariantRepository(),
  new OrderRepository(),
);
