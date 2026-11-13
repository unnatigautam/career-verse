
import mongoose, { Schema, type Document } from "mongoose";

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  education: string;
  field: string;
  interests: string[];
  skills: string[];
  experience: string;
  workPreference: string;
  careerGoal: string;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    education: { type: String, default: "" },
    field: { type: String, default: "" },
    interests: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    experience: { type: String, default: "" },
    workPreference: { type: String, default: "" },
    careerGoal: { type: String, default: "" },
  },
  { timestamps: true }
);

const Profile =
  mongoose.models.Profile ||
  mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;
