import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  employmentType: string;
  companyLogoKey: string;
  tags: string[];
  description: string;
  postedBy: mongoose.Types.ObjectId; // ref: User (employer)
  status: "Active" | "Closed" | "Draft";
  featured: boolean;
  applicantCount: number;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>({
  title:          { type: String, required: true },
  company:        { type: String, required: true },
  location:       { type: String, required: true },
  employmentType: { type: String, required: true },
  companyLogoKey: { type: String, default: "" },
  tags:           [{ type: String }],
  description:    { type: String, default: "" },
  postedBy:       { type: Schema.Types.ObjectId, ref: "User", required: true },
  status:         { type: String, enum: ["Active", "Closed", "Draft"], default: "Active" },
  featured:       { type: Boolean, default: false },
  applicantCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IJob>("Job", JobSchema);