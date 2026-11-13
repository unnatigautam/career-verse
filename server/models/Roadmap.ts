
import mongoose, { Schema, type Document } from "mongoose";

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId;
  completedTasks: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roadmapSchema = new Schema<IRoadmap>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    completedTasks: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Roadmap =
  mongoose.models.Roadmap ||
  mongoose.model<IRoadmap>("Roadmap", roadmapSchema);

export default Roadmap;
