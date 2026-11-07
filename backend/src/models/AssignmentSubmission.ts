import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignmentSubmission extends Document {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  submittedFileName: string;
  fileUrl?: string;
  status: 'SUBMITTED' | 'GRADED' | 'OVERDUE';
  obtainedScore?: number;
  facultyFeedback?: string;
  gradedBy?: string;
  submittedAt: Date;
  gradedAt?: Date;
}

const AssignmentSubmissionSchema = new Schema<IAssignmentSubmission>(
  {
    submissionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    assignmentId: {
      type: String,
      required: true,
      ref: 'Assignment',
      index: true
    },
    studentId: {
      type: String,
      required: true,
      ref: 'Student',
      index: true
    },
    submittedFileName: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'GRADED', 'OVERDUE'],
      default: 'SUBMITTED',
      index: true
    },
    obtainedScore: {
      type: Number,
      default: null,
      min: 0.0
    },
    facultyFeedback: {
      type: String,
      default: null
    },
    gradedBy: {
      type: String,
      ref: 'Teacher',
      default: null
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    gradedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: false
  }
);

// Prevent duplicate assignment submissions for same student and assignment
AssignmentSubmissionSchema.index(
  { assignmentId: 1, studentId: 1 },
  { unique: true, name: 'uq_student_assignment' }
);

export const AssignmentSubmission = mongoose.model<IAssignmentSubmission>('AssignmentSubmission', AssignmentSubmissionSchema);
export default AssignmentSubmission;
