import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import passport from "passport";
import { body, validationResult } from "express-validator";
import User, { IUser } from "../models/User";
import { requireAuth } from "../middleware/auth";
import {
  createVerificationBundle,
  hashVerificationValue,
  sendVerificationEmail,
} from "../services/emailVerification";

const router = Router();

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function signAccessToken(userId: string) {
  const opts: SignOptions = {
    expiresIn: (process.env["JWT_ACCESS_EXPIRES_IN"] ??
      "15m") as SignOptions["expiresIn"],
  };
  return jwt.sign({ sub: userId }, process.env["JWT_ACCESS_SECRET"]!, opts);
}

function serializeUser(user: IUser) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    companyLogo: user.companyLogo,
    avatar: user.avatar,
    emailVerifiedAt: user.emailVerifiedAt ?? null,
    industry: user.industry,
    website: user.website,
    location: user.location,
    companySize: user.companySize,
    about: user.about,
    phone: user.phone,
    resumeLink: user.resumeLink,
    coverLetterTemplate: user.coverLetterTemplate,
  };
}

// POST /api/auth/register
router.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("name").notEmpty(),
  body("role").optional().isIn(["employer", "jobseeker"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedRole = role === "jobseeker" ? "jobseeker" : "employer";
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists)
      return res.status(409).json({ message: "Email already in use." });

    const passwordHash = await bcrypt.hash(password, 12);
    const verification = createVerificationBundle(normalizedEmail);
    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: normalizedRole,
      emailVerifiedAt: null,
      avatar: "",
      company: "",
      companyLogo: "",
      industry: "",
      website: "",
      location: "",
      companySize: "",
      about: "",
      phone: "",
      resumeLink: "",
      coverLetterTemplate: "",
      emailVerificationTokenHash: verification.tokenHash,
      emailVerificationTokenExpiresAt: verification.tokenExpiresAt,
      emailVerificationOtpHash: verification.otpHash,
      emailVerificationOtpExpiresAt: verification.otpExpiresAt,
      emailVerificationSentAt: new Date(),
    });

    try {
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        roleLabel: user.role === "employer" ? "Employee" : "Job Seeker",
        otp: verification.otp,
        verificationUrl: verification.verificationUrl,
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }

    res.status(201).json({
      message: "Account created. Check your inbox to verify your email.",
      email: user.email,
      role: user.role,
      verificationRequired: true,
    });
  },
);

// POST /api/auth/verify-email
router.post(
  "/verify-email",
  body("email").isEmail().normalizeEmail(),
  body("token").optional().isString(),
  body("otp").optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { email, token, otp } = req.body as {
      email: string;
      token?: string;
      otp?: string;
    };
    const normalizedEmail = String(email).trim().toLowerCase();
    const now = new Date();

    if (!token && !otp) {
      return res
        .status(422)
        .json({ message: "Provide either a verification token or OTP." });
    }

    const query: Record<string, unknown> = { email: normalizedEmail };
    if (token) {
      query.emailVerificationTokenHash = hashVerificationValue(token);
      query.emailVerificationTokenExpiresAt = { $gt: now };
    } else if (otp) {
      query.emailVerificationOtpHash = hashVerificationValue(otp);
      query.emailVerificationOtpExpiresAt = { $gt: now };
    }

    const user = await User.findOne(query).select(
      "+emailVerificationTokenHash +emailVerificationTokenExpiresAt +emailVerificationOtpHash +emailVerificationOtpExpiresAt",
    );
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    user.emailVerifiedAt = now;
    user.emailVerificationTokenHash = null;
    user.emailVerificationTokenExpiresAt = null;
    user.emailVerificationOtpHash = null;
    user.emailVerificationOtpExpiresAt = null;
    user.emailVerificationSentAt = null;
    await user.save();

    const tokenValue = signAccessToken(String(user._id));
    res.json({
      message: "Email verified successfully.",
      user: serializeUser(user),
      token: tokenValue,
      expiresIn: 900,
    });
  },
);

// POST /api/auth/resend-verification
router.post(
  "/resend-verification",
  body("email").isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { email } = req.body as { email: string };
    const normalizedEmail = String(email).trim().toLowerCase();
    const emailRegex = new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i");
    const user = await User.findOne({ email: emailRegex });

    if (!user) {
      return res.status(200).json({
        message: "If an account exists, a verification email has been sent.",
      });
    }

    if (user.emailVerifiedAt) {
      return res
        .status(200)
        .json({ message: "This email is already verified." });
    }

    const verification = createVerificationBundle(normalizedEmail);
    if (user.email !== normalizedEmail) {
      user.email = normalizedEmail;
    }
    user.emailVerificationTokenHash = verification.tokenHash;
    user.emailVerificationTokenExpiresAt = verification.tokenExpiresAt;
    user.emailVerificationOtpHash = verification.otpHash;
    user.emailVerificationOtpExpiresAt = verification.otpExpiresAt;
    user.emailVerificationSentAt = new Date();
    await user.save();

    try {
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        roleLabel: user.role === "employer" ? "Employee" : "Job Seeker",
        otp: verification.otp,
        verificationUrl: verification.verificationUrl,
      });
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    }

    res.status(200).json({ message: "Verification email sent." });
  },
);

// POST /api/auth/login
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: Error, user: IUser, info: { message: string }) => {
      if (err || !user)
        return res
          .status(
            info?.message === "Please verify your email before signing in."
              ? 403
              : 401,
          )
          .json({ message: info?.message ?? "Authentication failed." });
      const token = signAccessToken(String(user._id));
      res.json({
        user: serializeUser(user),
        token,
        expiresIn: 900,
      });
    },
  )(req, res, next);
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  const user = req.user as IUser;
  res.json({
    ...serializeUser(user),
  });
});

// GET /api/auth/profile
router.get("/profile", requireAuth, async (req, res) => {
  const user = await User.findById((req.user as IUser)._id);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json(serializeUser(user));
});

// PUT /api/auth/profile
router.put(
  "/profile",
  [body("email").optional().isEmail().withMessage("Invalid email address.")],
  requireAuth,
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const user = await User.findById((req.user as IUser)._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const commonAllowed = ["name", "location", "phone"] as const;
    const employerAllowed = [
      "company",
      "companyLogo",
      "avatar",
      "industry",
      "website",
      "companySize",
      "about",
    ] as const;
    const seekerAllowed = ["resumeLink", "coverLetterTemplate"] as const;

    for (const key of commonAllowed) {
      if (req.body[key] !== undefined)
        (user as unknown as Record<string, unknown>)[key] = req.body[key];
    }

    if (user.role === "employer" || user.role === "admin") {
      for (const key of employerAllowed) {
        if (req.body[key] !== undefined)
          (user as unknown as Record<string, unknown>)[key] = req.body[key];
      }
    }

    if (user.role === "jobseeker" || user.role === "admin") {
      for (const key of seekerAllowed) {
        if (req.body[key] !== undefined)
          (user as unknown as Record<string, unknown>)[key] = req.body[key];
      }
    }

    await user.save();
    res.json(serializeUser(user));
  },
);

// POST /api/auth/logout
// No auth required — JWT is stateless and logout is a client-side token discard.
// If you add server-side refresh token revocation later, add requireAuth back
// and invalidate the refresh token in Redis here.
router.post("/logout", (_req, res) => {
  res.status(200).json({ message: "Logged out." });
});

export default router;
