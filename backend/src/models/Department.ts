import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  deptId: string;
  code: string;
  name: string;
  chairPerson: string;
  establishedYear: number;
  email: string;
  facultyCount: number;
  studentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    deptId: {
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
      uppercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    chairPerson: {
      type: String,
      required: true,
      trim: true
    },
    establishedYear: {
      type: Number,
      required: true,
      min: 1990,
      max: 2100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    facultyCount: {
      type: Number,
      default: 0,
      min: 0
    },
    studentCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
export default Department;
