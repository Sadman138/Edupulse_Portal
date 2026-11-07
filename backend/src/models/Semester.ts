import mongoose, { Document, Schema } from 'mongoose';

export interface ISemester extends Document {
  semesterId: string;
  name: string;
  sessionCode: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  maxCredits: number;
  enrollmentDeadline: Date;
  createdAt: Date;
}

const SemesterSchema = new Schema<ISemester>(
  {
    semesterId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true // e.g. 'Spring 2026'
    },
    sessionCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true // e.g. 'SP-2026'
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: any, val: Date) {
          return val >= this.startDate;
        },
        message: 'End date must be greater than or equal to start date.'
      }
    },
    isActive: {
      type: Boolean,
      default: false,
      index: true
    },
    maxCredits: {
      type: Number,
      default: 15.0,
      min: 1.0,
      max: 25.0
    },
    enrollmentDeadline: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const Semester = mongoose.model<ISemester>('Semester', SemesterSchema);
export default Semester;
