import mongoose, { Document, Schema } from 'mongoose';

export interface IStudyMaterial extends Document {
  materialId: string;
  allocationId: string;
  topic: string;
  unitModule: string;
  description?: string;
  fileType: 'PDF' | 'SLIDES' | 'ZIP' | 'DOC' | 'CODE';
  fileSizeKb: number;
  downloadUrl?: string;
  downloadCount: number;
  uploadedBy: string;
  uploadedAt: Date;
}

const StudyMaterialSchema = new Schema<IStudyMaterial>(
  {
    materialId: {
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
    topic: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    unitModule: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: null
    },
    fileType: {
      type: String,
      enum: ['PDF', 'SLIDES', 'ZIP', 'DOC', 'CODE'],
      default: 'PDF'
    },
    fileSizeKb: {
      type: Number,
      default: 1024,
      min: 1
    },
    downloadUrl: {
      type: String,
      default: null
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0
    },
    uploadedBy: {
      type: String,
      ref: 'Teacher',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

export const StudyMaterial = mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema);
export default StudyMaterial;
