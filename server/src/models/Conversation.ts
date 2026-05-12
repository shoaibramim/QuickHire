import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  applicationId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  employerId: mongoose.Types.ObjectId;
  jobSeekerId: mongoose.Types.ObjectId;
  jobTitle: string;
  companyName: string;
  jobSeekerName: string;
  lastMessageAt?: Date | null;
  lastMessagePreview?: string;
  lastMessageId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
    },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobSeekerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    jobSeekerName: { type: String, required: true },
    lastMessageAt: { type: Date, default: null },
    lastMessagePreview: { type: String, default: "" },
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true },
);

ConversationSchema.index({ employerId: 1, updatedAt: -1 });
ConversationSchema.index({ jobSeekerId: 1, updatedAt: -1 });

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema,
);
