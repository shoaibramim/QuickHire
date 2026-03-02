import { Router } from "express";
import { body, validationResult } from "express-validator";
import { requireAuth, requireRole } from "../middleware/auth";
import Job from "../models/Job";
import Application from "../models/Application";
import Message from "../models/Message";
import ScheduleEvent from "../models/ScheduleEvent";
import User, { IUser } from "../models/User";

const router = Router();
router.use(requireAuth, requireRole(["employer", "admin"]));

// GET /api/dashboard/overview
router.get("/overview", async (req, res) => {
  const userId = (req.user as IUser)._id;
  const today  = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); // "Mar 2, 2026"

  const [jobs, messages, scheduleToday] = await Promise.all([
    Job.find({ postedBy: userId }),
    Message.find({ ownerId: userId }),
    ScheduleEvent.find({ ownerId: userId, date: today }),
  ]);

  const jobIds     = jobs.map((j) => j._id);
  const applications = await Application.find({ jobId: { $in: jobIds } });

  // Applicant breakdown by employment type (cross-join applicants → jobs)
  const typeBuckets: Record<string, number> = {};
  for (const job of jobs) {
    const count = applications.filter((a) => String(a.jobId) === String(job._id)).length;
    typeBuckets[job.employmentType] = (typeBuckets[job.employmentType] ?? 0) + count;
  }
  const COLOR_MAP: Record<string, string> = {
    "Full Time":  "bg-brand-indigo",
    "Part Time":  "bg-amber-400",
    "Internship": "bg-blue-400",
    "Contract":   "bg-pink-400",
    "Remote":     "bg-green-400",
  };
  const applicantBreakdown = Object.entries(typeBuckets).map(([label, count]) => ({
    label, count, color: COLOR_MAP[label] ?? "bg-gray-400",
  }));

  // Last 7-day chart data
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sevenDaysAgo); d.setDate(d.getDate() + i);
    const dayApps = applications.filter((a) => {
      const created = new Date((a as { createdAt: Date }).createdAt);
      return created.toDateString() === d.toDateString();
    }).length;
    return { day: DAYS[d.getDay()]!, jobViews: 0, jobApplied: dayApps };
  });

  res.json({
    newCandidates:    applications.filter((a) => a.status === "Pending").length,
    scheduledToday:   scheduleToday.length,
    messages:         messages.filter((m) => m.unread).length,
    jobsOpen:         jobs.filter((j) => j.status === "Active").length,
    totalApplicants:  applications.length,
    weeklyStats: {
      jobViews:        0,
      jobViewsTrend:   0,
      jobApplied:      applications.length,
      jobAppliedTrend: 0,
    },
    chartData,
    applicantBreakdown,
  });
});

// GET /api/dashboard/jobs
router.get("/jobs", async (req, res) => {
  const jobs = await Job.find({ postedBy: (req.user as IUser)._id }).sort({ createdAt: -1 });
  res.json(jobs);
});

// GET /api/dashboard/jobs/:id — single job for edit modal
router.get("/jobs/:id", async (req: any, res: any) => {
  const job = await Job.findOne({ _id: req.params.id, postedBy: (req.user as IUser)._id });
  if (!job) return res.status(404).json({ message: "Job not found." });
  res.json(job);
});

// PATCH /api/dashboard/jobs/:id — update job fields
router.patch("/jobs/:id", async (req: any, res: any) => {
  const job = await Job.findOne({ _id: req.params.id, postedBy: (req.user as IUser)._id });
  if (!job) return res.status(404).json({ message: "Job not found." });

  const allowed = ["title", "company", "location", "employmentType", "description", "status"] as const;
  for (const key of allowed) {
    if (req.body[key] !== undefined) (job as any)[key] = req.body[key];
  }
  if (req.body.tags !== undefined) {
    job.tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : String(req.body.tags).split(",").map((t: string) => t.trim()).filter(Boolean);
  }
  await job.save();
  res.json(job);
});

// GET /api/dashboard/applicants
router.get("/applicants", async (req, res) => {
  const jobs         = await Job.find({ postedBy: (req.user as IUser)._id });
  const applications = await Application.find({ jobId: { $in: jobs.map((j) => j._id) } }).sort({ createdAt: -1 });
  // Enrich with job title for display
  const enriched = applications.map((a) => {
    const job = jobs.find((j) => String(j._id) === String(a.jobId));
    return {
      id:          String(a._id),
      name:        a.name,
      email:       a.email,
      resumeLink:  a.resumeLink,
      coverNote:   a.coverNote,
      role:        job?.title ?? "Unknown Role",
      company:     job?.company ?? "",
      appliedDate: new Date((a as { createdAt: Date }).createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status:      a.status,
    };
  });
  res.json(enriched);
});

// PATCH /api/dashboard/applicants/:id/status
router.patch("/applicants/:id/status", async (req, res) => {
  const application = await Application.findByIdAndUpdate(
    req.params.id, { status: req.body.status }, { new: true }
  );
  if (!application) return res.status(404).json({ message: "Application not found." });
  res.json(application);
});

// POST /api/dashboard/jobs — create a new job listing
router.post(
  "/jobs",
  [
    body("title").notEmpty().withMessage("Job title is required."),
    body("location").notEmpty().withMessage("Location is required."),
    body("employmentType").notEmpty().withMessage("Employment type is required."),
    body("description").notEmpty().withMessage("Description is required."),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const user   = req.user as IUser;
    const { title, company, location, employmentType, description, tags, status } = req.body;

    const job = await Job.create({
      title,
      company:   company || user.company || "My Company",
      location,
      employmentType,
      description,
      tags:       Array.isArray(tags) ? tags : (tags ? String(tags).split(",").map((t: string) => t.trim()).filter(Boolean) : []),
      status:     status ?? "Active",
      postedBy:   user._id,
      applicantCount: 0,
    });

    res.status(201).json(job);
  }
);

// PATCH /api/dashboard/jobs/:id/status — close or reopen a job
router.patch("/jobs/:id/status", async (req: any, res: any) => {
  const job = await Job.findOne({ _id: req.params["id"], postedBy: (req.user as IUser)._id });
  if (!job) return res.status(404).json({ message: "Job not found." });
  job.status = req.body.status;
  await job.save();
  res.json(job);
});

// GET /api/dashboard/profile — return employer profile
router.get("/profile", async (req: any, res: any) => {
  const user = await User.findById((req.user as IUser)._id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json(user);
});

// PUT /api/dashboard/profile — update employer profile & company logo
router.put(
  "/profile",
  [
    body("email").optional().isEmail().withMessage("Invalid email address."),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const allowed = ["name", "company", "companyLogo", "avatar", "industry", "website", "location", "companySize", "about", "phone"] as const;
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    // Validate base64 image size (max 2 MB) to avoid bloating the DB
    if (typeof update["companyLogo"] === "string" && update["companyLogo"].startsWith("data:")) {
      const sizeBytes = Buffer.byteLength(update["companyLogo"] as string, "base64");
      if (sizeBytes > 2 * 1024 * 1024) {
        return res.status(413).json({ message: "Logo image must be under 2 MB." });
      }
    }

    const user = await User.findByIdAndUpdate(
      (req.user as IUser)._id,
      { $set: update },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    res.json(user);
  }
);

export default router;