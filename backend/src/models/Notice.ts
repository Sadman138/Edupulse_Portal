import mongoose, { Document, Schema } from 'mongoose';

export interface INotice extends Document {
  noticeId: string;
  title: string;
  category: 'General' | 'Exam' | 'Academic' | 'Holiday' | 'Emergency';
  priority: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  content: string;
  targetAudience: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'DEPARTMENT';
  departmentId?: string;
  authorId: string;
  attachmentName?: string;
  attachmentUrl?: string;
  publishedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    noticeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['General', 'Exam', 'Academic', 'Holiday', 'Emergency'],
      default: 'General'
    },
    priority: {
      type: String,
      enum: ['NORMAL', 'IMPORTANT', 'URGENT'],
      default: 'NORMAL'
    },
    content: {
      type: String,
      required: true
    },
    targetAudience: {
      type: String,
      enum: ['ALL', 'STUDENTS', 'TEACHERS', 'DEPARTMENT'],
      default: 'ALL'
    },
    departmentId: {
      type: String,
      ref: 'Department',
      default: null
    },
    authorId: {
      type: String,
      ref: 'User',
      required: true
    },
    attachmentName: {
      type: String,
      default: null
    },
    attachmentUrl: {
      type: String,
      default: null
    },
    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

NoticeSchema.index({ targetAudience: 1, priority: 1, publishedAt: -1 });

export const Notice = mongoose.model<INotice>('Notice', NoticeSchema);
export default Notice;
