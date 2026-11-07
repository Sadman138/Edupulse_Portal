import mongoose, { Document, Schema } from 'mongoose';

export interface IOTPVerification extends Document {
  email: string;
  otpHash: string;
  salt: string;
  attempts: number;
  isUsed: boolean;
  expiresAt: Date;
  lastSentAt: Date;
  createdAt: Date;
}

const OTPVerificationSchema = new Schema<IOTPVerification>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    otpHash: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      default: ''
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL index: automatically deletes document when expiresAt passes
    },
    lastSentAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Compound index for querying active, non-expired OTP by email
OTPVerificationSchema.index({ email: 1, isUsed: 1, expiresAt: 1 });

export const OTPVerification = mongoose.model<IOTPVerification>('OTPVerification', OTPVerificationSchema);
export default OTPVerification;
