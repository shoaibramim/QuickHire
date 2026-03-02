import mongoose, { Document, Schema } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
}, { timestamps: { createdAt: "subscribedAt", updatedAt: false } });

export default mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
