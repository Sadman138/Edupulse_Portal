import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseEvaluation extends Document {
  evalId: string;
  enrollmentId: string;
  quiz1: number;
  quiz2: number;
  midterm: number;
  assignment: number;
  finalExam: number;
  totalMarks: number;
  letterGrade: string;
  gpa: number;
  evaluatedBy?: string;
  updatedAt: Date;
}

const CourseEvaluationSchema = new Schema<ICourseEvaluation>(
  {
    evalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    enrollmentId: {
      type: String,
      required: true,
      unique: true,
      ref: 'CourseEnrollment',
      index: true
    },
    quiz1: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 20.0
    },
    quiz2: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 20.0
    },
    midterm: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 30.0
    },
    assignment: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 10.0
    },
    finalExam: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 40.0
    },
    totalMarks: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 100.0
    },
    letterGrade: {
      type: String,
      default: 'F',
      trim: true
    },
    gpa: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 4.0
    },
    evaluatedBy: {
      type: String,
      ref: 'Teacher',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to calculate total marks, letter grade, and GPA deterministically
CourseEvaluationSchema.pre('save', function (next) {
  this.totalMarks = Number(
    (this.quiz1 + this.quiz2 + this.midterm + this.assignment + this.finalExam).toFixed(2)
  );

  // Standard Metropolitan University UGC Grading Scale
  if (this.totalMarks >= 80) {
    this.letterGrade = 'A+';
    this.gpa = 4.0;
  } else if (this.totalMarks >= 75) {
    this.letterGrade = 'A';
    this.gpa = 3.75;
  } else if (this.totalMarks >= 70) {
    this.letterGrade = 'A-';
    this.gpa = 3.5;
  } else if (this.totalMarks >= 65) {
    this.letterGrade = 'B+';
    this.gpa = 3.25;
  } else if (this.totalMarks >= 60) {
    this.letterGrade = 'B';
    this.gpa = 3.0;
  } else if (this.totalMarks >= 55) {
    this.letterGrade = 'B-';
    this.gpa = 2.75;
  } else if (this.totalMarks >= 50) {
    this.letterGrade = 'C+';
    this.gpa = 2.5;
  } else if (this.totalMarks >= 45) {
    this.letterGrade = 'C';
    this.gpa = 2.25;
  } else if (this.totalMarks >= 40) {
    this.letterGrade = 'D';
    this.gpa = 2.0;
  } else {
    this.letterGrade = 'F';
    this.gpa = 0.0;
  }
  next();
});

CourseEvaluationSchema.index({ letterGrade: 1, gpa: 1 });

export const CourseEvaluation = mongoose.model<ICourseEvaluation>('CourseEvaluation', CourseEvaluationSchema);
export default CourseEvaluation;
