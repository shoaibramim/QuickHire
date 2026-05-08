import passport from "passport";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const requireAuth = passport.authenticate("jwt", { session: false });

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: unknown) => {
      if (!err && user) {
        req.user = user;
      }
      next();
    },
  )(req, res, next);
};

export const requireRole =
  (roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const normalize = (value: string) =>
      value.toLowerCase().replace(/[\s-]/g, "");
    const allowed = roles.map(normalize);
    const user = req.user as
      | { role?: string; _id?: unknown; id?: string }
      | undefined;
    let role = normalize(user?.role ?? "");

    if (!role && user) {
      const rawId =
        typeof user.id === "string" && user.id
          ? user.id
          : String(user._id ?? "");
      if (rawId && mongoose.Types.ObjectId.isValid(rawId)) {
        const dbUser = await User.findById(rawId);
        if (dbUser) {
          req.user = dbUser;
          role = normalize(dbUser.role ?? "");
        }
      }
    }

    if (!role || !allowed.includes(role)) {
      return res.status(403).json({ message: "Forbidden." });
    }
    next();
  };
