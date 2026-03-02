import { Router } from "express";
import Job from "../models/Job";
import Application from "../models/Application";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/jobs                — public job board (with ?category, ?q, ?location, ?type, ?featured filters)
router.get("/", async (req, res) => {
  const { q, category, location, type, featured } = req.query;
  const filter: Record<string, unknown> = { status: "Active" };
  if (q)        filter.title    = { $regex: q, $options: "i" };
  if (category) filter.tags     = category;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (type)     filter.employmentType = type;
  if (featured === "true") filter.featured = true;
  const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json(jobs);
});

// GET /api/jobs/featured       — landing page: latest 8 jobs with featured: true
router.get("/featured", async (_req, res) => {
  const jobs = await Job.find({ status: "Active", featured: true }).sort({ createdAt: -1 }).limit(8);
  res.json(jobs);
});

// GET /api/jobs/latest         — landing page: latest 10 jobs (regardless of featured)
router.get("/latest", async (_req, res) => {
  const jobs = await Job.find({ status: "Active" }).sort({ createdAt: -1 }).limit(10);
  res.json(jobs);
});

// GET /api/jobs/categories     — all categories with active job counts
router.get("/categories", async (_req, res) => {
  const counts = await Job.aggregate([
    { $match: { status: "Active" } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.json(counts);
});

// GET /api/jobs/:id            — single job detail page
router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found." });
  res.json(job);
});

// POST /api/jobs/:id/apply     — replaces the Next.js route handler in app/api/jobs/[id]/apply/route.ts
router.post("/:id/apply", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job || job.status !== "Active") return res.status(404).json({ message: "Job not found or closed." });

  const { name, email, resume_link, cover_note } = req.body;
  if (!name || !email || !resume_link) {
    return res.status(422).json({ message: "name, email, and resume_link are required." });
  }

  try {
    const url = new URL(resume_link);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
  } catch {
    return res.status(422).json({ error: "Please provide a valid resume link (must start with http:// or https://)." });
  }

  const application = await Application.create({
    jobId: job._id, name, email, resumeLink: resume_link, coverNote: cover_note ?? "",
  });
  await Job.findByIdAndUpdate(job._id, { $inc: { applicantCount: 1 } });

  res.status(201).json({ success: true, message: "Application submitted successfully!", id: application._id });
});

// POST /api/jobs               — employer posts a new job (protected)
router.post("/", requireAuth, requireRole(["employer", "admin"]), async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: (req.user as { _id: string })._id });
  res.status(201).json(job);
});

export default router;