import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import Message from "../models/Message";
import { IUser } from "../models/User";

const router = Router();
router.use(requireAuth, requireRole(["employer", "admin"]));

// GET /api/dashboard/messages
router.get("/", async (req, res) => {
  const userId = (req.user as IUser)._id;
  const messages = await Message.find({ ownerId: userId }).sort({ createdAt: -1 });
  res.json(messages);
});

// PATCH /api/dashboard/messages/:id/read  — mark as read
router.patch("/:id/read", async (req, res) => {
  const msg = await Message.findByIdAndUpdate(
    req.params.id,
    { unread: false },
    { new: true }
  );
  if (!msg) return res.status(404).json({ message: "Message not found." });
  res.json(msg);
});

export default router;
