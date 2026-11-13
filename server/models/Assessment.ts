
import mongoose, { Schema, type Document } from "mongoose";

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  answers: Record<string, unknown>;
  result: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    answers: {
      type: Schema.Types.Mixed,
      required: true,
    },
    result: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

assessmentSchema.index({ userId: 1, createdAt: -1 });

const Assessment =
  mongoose.models.Assessment ||
  mongoose.model<IAssessment>("Assessment", assessmentSchema);

export default Assessment;
