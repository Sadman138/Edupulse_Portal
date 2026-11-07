import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  courseId: string;
  code: string;
  title: string;
  credits: number;
  departmentId: string;
  type: 'Theory' | 'Lab' | 'Project';
  description?: string;
  createdAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true // e.g. 'CSE311'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    credits: {
      type: Number,
      required: true,
      min: 0.5,
      max: 6.0
    },
    departmentId: {
      type: String,
      required: true,
      ref: 'Department',
      index: true
    },
    type: {
      type: String,
      enum: ['Theory', 'Lab', 'Project'],
      default: 'Theory'
    },
    description: {
      type: String,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

CourseSchema.index({ departmentId: 1, code: 1 });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
export default Course;
