import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "employer" | "jobseeker" | "admin";
  avatar?: string;
  company?: string;
  companyLogo?: string;
  // Extended employer profile fields
  industry?: string;
  website?: string;
  location?: string;
  companySize?: string;
  about?: string;
  phone?: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false }, // never returned in queries
  role:         { type: String, enum: ["employer", "jobseeker", "admin"], default: "jobseeker" },
  avatar:       { type: String },
  company:      { type: String },
  companyLogo:  { type: String },
  industry:     { type: String },
  website:      { type: String },
  location:     { type: String },
  companySize:  { type: String },
  about:        { type: String },
  phone:        { type: String },
}, { timestamps: true });

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export default mongoose.model<IUser>("User", UserSchema);