import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxLength: 40 },
    lastName: { type: String, trim: true, maxLength: 40, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

adminSchema.index({ email: 1 });

export interface IAdmin extends mongoose.Schema {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<IAdmin>('Admin', adminSchema);
