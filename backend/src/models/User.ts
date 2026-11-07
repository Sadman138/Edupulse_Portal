import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  email: string;
  passwordHash?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  authProvider: 'GOOGLE' | 'EMAIL';
  isEmailVerified: boolean;
  googleId?: string;
  avatarUrl?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    passwordHash: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ['STUDENT', 'TEACHER', 'ADMIN'],
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['APPROVED', 'PENDING', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    authProvider: {
      type: String,
      enum: ['GOOGLE', 'EMAIL'],
      default: 'EMAIL'
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    googleId: {
      type: String,
      default: null
    },
    avatarUrl: {
      type: String,
      default: null
    },
    rejectionReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index for role-based status queries (e.g. pending approvals by role)
UserSchema.index({ role: 1, status: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
export default User;
