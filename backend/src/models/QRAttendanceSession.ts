import mongoose, { Document, Schema } from 'mongoose';

export interface IQRAttendanceSession extends Document {
  sessionId: string;
  allocationId: string;
  sessionDate: Date;
  startTime: string;
  durationSeconds: number;
  sessionPin: string;
  qrTokenHash: string;
  isActive: boolean;
  createdAt: Date;
}

const QRAttendanceSessionSchema = new Schema<IQRAttendanceSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    allocationId: {
      type: String,
      required: true,
      ref: 'CourseAllocation',
      index: true
    },
    sessionDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true // e.g. '09:05:00'
    },
    durationSeconds: {
      type: Number,
      default: 60,
      min: 10
    },
    sessionPin: {
      type: String,
      required: true,
      trim: true // e.g. '849201'
    },
    qrTokenHash: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

QRAttendanceSessionSchema.index({ allocationId: 1, isActive: 1 });

export const QRAttendanceSession = mongoose.model<IQRAttendanceSession>('QRAttendanceSession', QRAttendanceSessionSchema);
export default QRAttendanceSession;
