import mongoose, { Document, Schema } from 'mongoose';

export interface IPreviousResultCourse {
  courseItemId?: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  obtainedGrade: string;
  obtainedGpa: number;
}

export interface IPreviousResult extends Document {
  submissionId: string;
  studentId: string;
  semesterName: string;
  completedCredits: number;
  sgpa: number;
  resultType: 'Regular' | 'Retake' | 'Improvement' | 'Backlog';
  documentName: string;
  documentUrl?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verificationDate?: Date;
  remarks?: string;
  courses: IPreviousResultCourse[];
  submittedAt: Date;
}

const PreviousResultCourseSchema = new Schema<IPreviousResultCourse>(
  {
    courseItemId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    courseCode: {
      type: String,
      required: true,
      trim: true
    },
    courseTitle: {
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
    obtainedGrade: {
      type: String,
      required: true,
      trim: true
    },
    obtainedGpa: {
      type: Number,
      required: true,
      min: 0.0,
      max: 4.0
    }
  },
  { _id: false }
);

const PreviousResultSchema = new Schema<IPreviousResult>(
  {
    submissionId: {
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
    semesterName: {
      type: String,
      required: true,
      trim: true
    },
    completedCredits: {
      type: Number,
      required: true,
      min: 0.0
    },
    sgpa: {
      type: Number,
      required: true,
      min: 0.0,
      max: 4.0
    },
    resultType: {
      type: String,
      enum: ['Regular', 'Retake', 'Improvement', 'Backlog'],
      default: 'Regular'
    },
    documentName: {
      type: String,
      required: true,
      trim: true
    },
    documentUrl: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    verifiedBy: {
      type: String,
      ref: 'Teacher',
      default: null
    },
    verificationDate: {
      type: Date,
      default: null
    },
    remarks: {
      type: String,
      default: null
    },
    courses: [PreviousResultCourseSchema],
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

PreviousResultSchema.index({ status: 1 });
PreviousResultSchema.index({ studentId: 1, status: 1 });

export const PreviousResult = mongoose.model<IPreviousResult>('PreviousResult', PreviousResultSchema);
export default PreviousResult;
