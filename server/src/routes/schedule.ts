import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import ScheduleEvent from "../models/ScheduleEvent";
import { IUser } from "../models/User";

const router = Router();
router.use(requireAuth, requireRole(["employer", "admin"]));

// GET /api/dashboard/schedule
router.get("/", async (req, res) => {
  const userId = (req.user as IUser)._id;
  const events = await ScheduleEvent.find({ ownerId: userId }).sort({ createdAt: 1 });
  res.json(events);
});

// POST /api/dashboard/schedule  — create a new event
router.post("/", async (req, res) => {
  const userId = (req.user as IUser)._id;
  const { title, time, date, type, withPerson } = req.body;
  if (!title || !time || !date || !type) {
    return res.status(422).json({ message: "title, time, date, and type are required." });
  }
  const event = await ScheduleEvent.create({ ownerId: userId, title, time, date, type, withPerson });
  res.status(201).json(event);
});

// DELETE /api/dashboard/schedule/:id
router.delete("/:id", async (req, res) => {
  const userId = (req.user as IUser)._id;
  const event = await ScheduleEvent.findOneAndDelete({ _id: req.params.id, ownerId: userId });
  if (!event) return res.status(404).json({ message: "Event not found." });
  res.status(204).send();
});

export default router;
