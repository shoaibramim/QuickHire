import mongoose, { Document, Schema } from "mongoose";

export interface IJobView extends Document {
  jobId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const JobViewSchema = new Schema<IJobView>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IJobView>("JobView", JobViewSchema);
