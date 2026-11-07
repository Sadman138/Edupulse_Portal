import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseAllocation extends Document {
  allocationId: string;
  courseId: string;
  teacherId: string;
  semesterId: string;
  section: string;
  dayOfWeek: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  roomNumber: string;
  maxCapacity: number;
  createdAt: Date;
}

const CourseAllocationSchema = new Schema<ICourseAllocation>(
  {
    allocationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    courseId: {
      type: String,
      required: true,
      ref: 'Course',
      index: true
    },
    teacherId: {
      type: String,
      required: true,
      ref: 'Teacher',
      index: true
    },
    semesterId: {
      type: String,
      required: true,
      ref: 'Semester',
      index: true
    },
    section: {
      type: String,
      default: 'A',
      trim: true
    },
    dayOfWeek: {
      type: String,
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true // e.g. '09:00 AM - 10:30 AM'
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true
    },
    maxCapacity: {
      type: Number,
      default: 50,
      min: 1
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Enforce schedule conflict prevention matching SQL UNIQUE constraints
CourseAllocationSchema.index(
  { semesterId: 1, dayOfWeek: 1, timeSlot: 1, roomNumber: 1 },
  { unique: true, name: 'uq_schedule_conflict' }
);
CourseAllocationSchema.index(
  { semesterId: 1, dayOfWeek: 1, timeSlot: 1, teacherId: 1 },
  { unique: true, name: 'uq_teacher_conflict' }
);
CourseAllocationSchema.index({ semesterId: 1, courseId: 1 });

export const CourseAllocation = mongoose.model<ICourseAllocation>('CourseAllocation', CourseAllocationSchema);
export default CourseAllocation;
