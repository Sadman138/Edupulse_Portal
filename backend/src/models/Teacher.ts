import mongoose, { Document, Schema } from 'mongoose';

export interface ITeacher extends Document {
  teacherId: string;
  userId: string;
  employeeId: string;
  fullName: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer' | 'Adjunct Faculty';
  departmentId: string;
  roomNumber?: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Sabbatical';
  joinedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    teacherId: {
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
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true // e.g. 'FAC-CSE-042'
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    designation: {
      type: String,
      enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Adjunct Faculty'],
      required: true
    },
    departmentId: {
      type: String,
      required: true,
      ref: 'Department',
      index: true
    },
    roomNumber: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Sabbatical'],
      default: 'Active',
      index: true
    },
    joinedDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

TeacherSchema.index({ departmentId: 1, employeeId: 1 });

export const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);
export default Teacher;
