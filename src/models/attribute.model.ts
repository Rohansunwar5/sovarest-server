import mongoose from 'mongoose';

const attributeValueSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, lowercase: true },
  meta: { type: Map, of: String, default: {} },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    unit: { type: String, trim: true, default: '' },
    values: { type: [attributeValueSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

attributeSchema.index({ slug: 1 });

export interface IAttributeValue {
  _id: mongoose.Types.ObjectId;
  label: string;
  slug: string;
  meta: Map<string, string>;
  displayOrder: number;
  isActive: boolean;
}

export interface IAttribute extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  unit: string;
  values: IAttributeValue[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<IAttribute>('Attribute', attributeSchema);
