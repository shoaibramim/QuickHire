import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import passport from "passport";
import { body, validationResult } from "express-validator";
import User, { IUser } from "../models/User";
import { requireAuth } from "../middleware/auth";

const router = Router();

function signAccessToken(userId: string) {
  const opts: SignOptions = { expiresIn: (process.env["JWT_ACCESS_EXPIRES_IN"] ?? "15m") as SignOptions["expiresIn"] };
  return jwt.sign({ sub: userId }, process.env["JWT_ACCESS_SECRET"]!, opts);
}

// POST /api/auth/register
router.post("/register",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("name").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: role ?? "jobseeker" });

    const token = signAccessToken(String(user._id));
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
      expiresIn: 900,
    });
  }
);

// POST /api/auth/login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err: Error, user: IUser, info: { message: string }) => {
    if (err || !user) return res.status(401).json({ message: info?.message ?? "Authentication failed." });
    const token = signAccessToken(String(user._id));
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, companyLogo: user.companyLogo, avatar: user.avatar },
      token,
      expiresIn: 900,
    });
  })(req, res, next);
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  const user = req.user as IUser;
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, companyLogo: user.companyLogo, avatar: user.avatar });
});

// POST /api/auth/logout
router.post("/logout", requireAuth, (_req, res) => {
  // Stateless JWT — client discards the token. If you add refresh tokens later, invalidate here.
  res.status(200).json({ message: "Logged out." });
});

export default router;