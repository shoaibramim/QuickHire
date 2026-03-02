import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  ownerId: mongoose.Types.ObjectId; // the employer who sees this inbox
  from: string;
  avatar?: string;
  preview: string;
  fullText?: string;
  unread: boolean;
  time: string; // human-readable "2h ago" stored for simplicity; use createdAt for sorting
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    ownerId:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    from:     { type: String, required: true },
    avatar:   { type: String },
    preview:  { type: String, required: true },
    fullText: { type: String },
    unread:   { type: Boolean, default: true },
    time:     { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
