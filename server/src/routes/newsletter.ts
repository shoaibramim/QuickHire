import { Router } from "express";
import { body, validationResult } from "express-validator";
import Subscriber from "../models/Subscriber";

const router = Router();

// POST /api/newsletter/subscribe
router.post(
  "/subscribe",
  body("email").isEmail().withMessage("A valid email is required."),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array()[0]?.msg ?? "Invalid email." });
    }

    const { email } = req.body as { email: string };

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      // Treat as success so we don't leak whether an email is subscribed
      return res.status(200).json({ message: "You're subscribed!" });
    }

    await Subscriber.create({ email });
    return res.status(201).json({ message: "You're subscribed!" });
  }
);

export default router;
