import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  studentId: string;
  userId: string;
  rollNumber: string;
  fullName: string;
  departmentId: string;
  batch: string;
  currentSemesterId: string;
  cgpa: number;
  overallAttendance: number;
  riskLevel: 'SAFE' | 'WARNING' | 'CRITICAL';
  phone: string;
  advisorName?: string;
  status: 'Active' | 'Probation' | 'Inactive' | 'Graduated';
  admissionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: 'User',
      index: true
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true // e.g. '241-115-211'
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    departmentId: {
      type: String,
      required: true,
      ref: 'Department',
      index: true
    },
    batch: {
      type: String,
      required: true,
      trim: true // e.g. '59th Batch'
    },
    currentSemesterId: {
      type: String,
      required: true,
      ref: 'Semester'
    },
    cgpa: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 4.0
    },
    overallAttendance: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 100.0
    },
    riskLevel: {
      type: String,
      enum: ['SAFE', 'WARNING', 'CRITICAL'],
      default: 'SAFE',
      index: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    advisorName: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['Active', 'Probation', 'Inactive', 'Graduated'],
      default: 'Active',
      index: true
    },
    admissionDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

StudentSchema.index({ departmentId: 1, riskLevel: 1 });
StudentSchema.index({ rollNumber: 1 });

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
export default Student;
