import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  assignmentId: string;
  allocationId: string;
  title: string;
  description: string;
  assignedDate: Date;
  dueDate: Date;
  totalPoints: number;
  attachmentUrl?: string;
  createdAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    assignmentId: {
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
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    assignedDate: {
      type: Date,
      required: true
    },
    dueDate: {
      type: Date,
      required: true,
      index: true
    },
    totalPoints: {
      type: Number,
      default: 10,
      min: 1
    },
    attachmentUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
export default Assignment;
