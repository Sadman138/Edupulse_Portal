import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendanceLog extends Document {
  logId: string;
  enrollmentId: string;
  sessionId?: string;
  date: Date;
  timeSlot: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  verifiedVia: 'DYNAMIC_QR' | 'MANUAL_ROSTER' | 'BIOMETRIC';
  tokenUsed?: string;
  loggedAt: Date;
}

const AttendanceLogSchema = new Schema<IAttendanceLog>(
  {
    logId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    enrollmentId: {
      type: String,
      required: true,
      ref: 'CourseEnrollment',
      index: true
    },
    sessionId: {
      type: String,
      ref: 'QRAttendanceSession',
      default: null
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE'],
      default: 'PRESENT',
      index: true
    },
    verifiedVia: {
      type: String,
      enum: ['DYNAMIC_QR', 'MANUAL_ROSTER', 'BIOMETRIC'],
      default: 'DYNAMIC_QR'
    },
    tokenUsed: {
      type: String,
      default: null
    },
    loggedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

// Ensure unique attendance entry per enrollment per date (matching SQL UNIQUE constraint)
AttendanceLogSchema.index(
  { enrollmentId: 1, date: 1 },
  { unique: true, name: 'uq_attendance_entry' }
);
AttendanceLogSchema.index({ date: 1, status: 1 });

export const AttendanceLog = mongoose.model<IAttendanceLog>('AttendanceLog', AttendanceLogSchema);
export default AttendanceLog;
