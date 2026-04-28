import mongoose from 'mongoose';

export interface IAddress extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

const addressSchema = new mongoose.Schema<IAddress>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

addressSchema.index({ userId: 1 });

export default mongoose.model<IAddress>('Address', addressSchema);
