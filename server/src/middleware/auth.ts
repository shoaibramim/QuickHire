import passport from "passport";
import { Request, Response, NextFunction } from "express";

export const requireAuth = passport.authenticate("jwt", { session: false });

export const requireRole = (roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role: string } | undefined;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden." });
    }
    next();
  };