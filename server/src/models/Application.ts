import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  jobId:       mongoose.Types.ObjectId;
  name:        string;
  email:       string;
  resumeLink:  string;
  coverNote:   string;
  status:      "Pending" | "Reviewed" | "Shortlisted" | "Rejected";
  createdAt:   Date;
}

const ApplicationSchema = new Schema<IApplication>({
  jobId:      { type: Schema.Types.ObjectId, ref: "Job", required: true },
  name:       { type: String, required: true },
  email:      { type: String, required: true, lowercase: true },
  resumeLink: { type: String, required: true },
  coverNote:  { type: String, default: "" },
  status:     { type: String, enum: ["Pending","Reviewed","Shortlisted","Rejected"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model<IApplication>("Application", ApplicationSchema);