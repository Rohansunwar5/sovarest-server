import mongoose from 'mongoose';

const categoryAttributeSchema = new mongoose.Schema(
  {
    attributeId:
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    displayOrder:
    {
      type: Number,
      default: 0
    },
  },
  { _id: false },
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, trim: true, default: '' },
    image: { type: String, default: '' },
    attributes: { type: [categoryAttributeSchema], default: [] },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, displayOrder: 1 });

export interface ICategoryAttribute {
  attributeId: mongoose.Types.ObjectId;
  displayOrder: number;
}

export interface ICategory extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  image: string;
  attributes: ICategoryAttribute[];
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<ICategory>('Category', categorySchema);
