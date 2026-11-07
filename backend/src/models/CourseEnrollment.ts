import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseEnrollment extends Document {
  enrollmentId: string;
  studentId: string;
  allocationId: string;
  semesterId: string;
  enrollmentStatus: 'ENROLLED' | 'DROPPED' | 'COMPLETED' | 'WITHDRAWN';
  finalLetterGrade?: string;
  finalGpa?: number;
  enrolledAt: Date;
}

const CourseEnrollmentSchema = new Schema<ICourseEnrollment>(
  {
    enrollmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    studentId: {
      type: String,
      required: true,
      ref: 'Student',
      index: true
    },
    allocationId: {
      type: String,
      required: true,
      ref: 'CourseAllocation',
      index: true
    },
    semesterId: {
      type: String,
      required: true,
      ref: 'Semester',
      index: true
    },
    enrollmentStatus: {
      type: String,
      enum: ['ENROLLED', 'DROPPED', 'COMPLETED', 'WITHDRAWN'],
      default: 'ENROLLED',
      index: true
    },
    finalLetterGrade: {
      type: String,
      default: null
    },
    finalGpa: {
      type: Number,
      default: null,
      min: 0.0,
      max: 4.0
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

// Prevent duplicate student enrollments in same allocation
CourseEnrollmentSchema.index(
  { studentId: 1, allocationId: 1 },
  { unique: true, name: 'uq_student_allocation' }
);

export const CourseEnrollment = mongoose.model<ICourseEnrollment>('CourseEnrollment', CourseEnrollmentSchema);
export default CourseEnrollment;
