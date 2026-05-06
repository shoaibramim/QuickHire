import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "employer" | "jobseeker" | "admin";
  emailVerifiedAt?: Date | null;
  emailVerificationTokenHash?: string | null;
  emailVerificationTokenExpiresAt?: Date | null;
  emailVerificationOtpHash?: string | null;
  emailVerificationOtpExpiresAt?: Date | null;
  emailVerificationSentAt?: Date | null;
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
  // Job seeker profile defaults used to prefill applications
  resumeLink?: string;
  coverLetterTemplate?: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false }, // never returned in queries
    role: {
      type: String,
      enum: ["employer", "jobseeker", "admin"],
      default: "jobseeker",
    },
    emailVerifiedAt: { type: Date, default: null },
    emailVerificationTokenHash: { type: String, select: false, default: null },
    emailVerificationTokenExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },
    emailVerificationOtpHash: { type: String, select: false, default: null },
    emailVerificationOtpExpiresAt: { type: Date, select: false, default: null },
    emailVerificationSentAt: { type: Date, default: null },
    avatar: { type: String, default: "" },
    company: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    industry: { type: String, default: "" },
    website: { type: String, default: "" },
    location: { type: String, default: "" },
    companySize: { type: String, default: "" },
    about: { type: String, default: "" },
    phone: { type: String, default: "" },
    resumeLink: { type: String, default: "" },
    coverLetterTemplate: { type: String, default: "" },
  },
  { timestamps: true },
);

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export default mongoose.model<IUser>("User", UserSchema);
