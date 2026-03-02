import mongoose, { Document, Schema } from "mongoose";

export type EventType = "Interview" | "Meeting" | "Review";

export interface IScheduleEvent extends Document {
  ownerId:    mongoose.Types.ObjectId;
  title:      string;
  time:       string; // e.g. "10:00 AM"
  date:       string; // e.g. "Mar 2, 2026"
  type:       EventType;
  withPerson?: string;
  createdAt:  Date;
}

const ScheduleEventSchema = new Schema<IScheduleEvent>(
  {
    ownerId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    title:      { type: String, required: true },
    time:       { type: String, required: true },
    date:       { type: String, required: true },
    type:       { type: String, enum: ["Interview", "Meeting", "Review"], required: true },
    withPerson: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IScheduleEvent>("ScheduleEvent", ScheduleEventSchema);
