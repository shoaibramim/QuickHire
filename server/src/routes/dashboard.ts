import { Router } from "express";
import { body, validationResult } from "express-validator";
import { requireAuth, requireRole } from "../middleware/auth";
import Job from "../models/Job";
import Application from "../models/Application";
import Message from "../models/Message";
import ScheduleEvent from "../models/ScheduleEvent";
import JobView from "../models/JobView";
import User, { IUser } from "../models/User";

type ChartPeriod = "Week" | "Month" | "Year";

function normalizePeriod(value: unknown): ChartPeriod {
  return value === "Month" || value === "Year" ? value : "Week";
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function buildChartBuckets(period: ChartPeriod) {
  const now = new Date();
  const buckets: { label: string; start: Date; end: Date }[] = [];

  if (period === "Year") {
    for (let i = 11; i >= 0; i -= 1) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0,
      );
      buckets.push({
        label: monthStart.toLocaleString("en-US", { month: "short" }),
        start: startOfDay(monthStart),
        end: endOfDay(monthEnd),
      });
    }
    return buckets;
  }

  const days = period === "Month" ? 28 : 7;
  const rangeStart = startOfDay(new Date(now));
  rangeStart.setDate(rangeStart.getDate() - (days - 1));

  if (period === "Month") {
    for (let i = 0; i < 4; i += 1) {
      const bucketStart = new Date(rangeStart);
      bucketStart.setDate(rangeStart.getDate() + i * 7);
      const bucketEnd = new Date(bucketStart);
      bucketEnd.setDate(bucketStart.getDate() + 6);
      buckets.push({
        label: bucketStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        start: startOfDay(bucketStart),
        end: endOfDay(bucketEnd),
      });
    }
    return buckets;
  }

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(rangeStart);
    day.setDate(rangeStart.getDate() + i);
    buckets.push({
      label: DAYS[day.getDay()]!,
      start: startOfDay(day),
      end: endOfDay(day),
    });
  }
  return buckets;
}

const router = Router();
router.use(requireAuth);

// GET /api/dashboard/overview
router.get(
  "/overview",
  requireRole(["employer", "admin"]),
  async (req, res) => {
    const period = normalizePeriod(req.query.period);
    const userId = (req.user as IUser)._id;
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }); // "Mar 2, 2026"

    const [jobs, unreadMessages, scheduleToday] = await Promise.all([
      Job.find({ postedBy: userId }),
      Message.countDocuments({ recipientId: userId, unread: true }),
      ScheduleEvent.find({ ownerId: userId, date: today }),
    ]);

    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } });

    const buckets = buildChartBuckets(period);
    const rangeStart = buckets[0]?.start;
    const rangeEnd = buckets[buckets.length - 1]?.end;
    const jobViews =
      jobIds.length && rangeStart && rangeEnd
        ? await JobView.find({
            jobId: { $in: jobIds },
            createdAt: { $gte: rangeStart, $lte: rangeEnd },
          }).select("createdAt")
        : [];

    // Applicant breakdown by employment type (cross-join applicants → jobs)
    const typeBuckets: Record<string, number> = {};
    for (const job of jobs) {
      const count = applications.filter(
        (a) => String(a.jobId) === String(job._id),
      ).length;
      typeBuckets[job.employmentType] =
        (typeBuckets[job.employmentType] ?? 0) + count;
    }
    const COLOR_MAP: Record<string, string> = {
      "Full Time": "bg-brand-indigo",
      "Part Time": "bg-amber-400",
      Internship: "bg-blue-400",
      Contract: "bg-pink-400",
      Remote: "bg-green-400",
    };
    const EMPLOYMENT_TYPES = [
      "Full Time",
      "Part Time",
      "Internship",
      "Contract",
      "Remote",
    ];
    const orderedTypes = [
      ...EMPLOYMENT_TYPES,
      ...Object.keys(typeBuckets).filter(
        (label) => !EMPLOYMENT_TYPES.includes(label),
      ),
    ];
    const applicantBreakdown = orderedTypes.map((label) => ({
      label,
      count: typeBuckets[label] ?? 0,
      color: COLOR_MAP[label] ?? "bg-gray-400",
    }));

    const chartData = buckets.map((bucket) => {
      const jobApplied = applications.filter((a) => {
        const created = new Date((a as { createdAt: Date }).createdAt);
        return created >= bucket.start && created <= bucket.end;
      }).length;
      const jobViewCount = jobViews.filter((view) => {
        const created = new Date((view as { createdAt: Date }).createdAt);
        return created >= bucket.start && created <= bucket.end;
      }).length;
      return { day: bucket.label, jobViews: jobViewCount, jobApplied };
    });

    res.json({
      newCandidates: applications.filter((a) => a.status === "Pending").length,
      scheduledToday: scheduleToday.length,
      messages: unreadMessages,
      jobsTotal: jobs.length,
      jobsOpen: jobs.filter((j) => j.status === "Active").length,
      totalApplicants: applications.length,
      weeklyStats: {
        jobViews: jobViews.length,
        jobViewsTrend: 0,
        jobApplied: applications.length,
        jobAppliedTrend: 0,
      },
      chartData,
      applicantBreakdown,
    });
  },
);

// GET /api/dashboard/jobs
router.get("/jobs", requireRole(["employer", "admin"]), async (req, res) => {
  const jobs = await Job.find({ postedBy: (req.user as IUser)._id }).sort({
    createdAt: -1,
  });
  res.json(jobs);
});

// GET /api/dashboard/jobs/:id — single job for edit modal
router.get(
  "/jobs/:id",
  requireRole(["employer", "admin"]),
  async (req: any, res: any) => {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: (req.user as IUser)._id,
    });
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json(job);
  },
);

// PATCH /api/dashboard/jobs/:id — update job fields
router.patch(
  "/jobs/:id",
  requireRole(["employer", "admin"]),
  async (req: any, res: any) => {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: (req.user as IUser)._id,
    });
    if (!job) return res.status(404).json({ message: "Job not found." });

    const allowed = [
      "title",
      "company",
      "location",
      "employmentType",
      "description",
      "status",
    ] as const;
    for (const key of allowed) {
      if (req.body[key] !== undefined) (job as any)[key] = req.body[key];
    }
    if (req.body.tags !== undefined) {
      job.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : String(req.body.tags)
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean);
    }
    await job.save();
    res.json(job);
  },
);

// GET /api/dashboard/applicants
router.get(
  "/applicants",
  requireRole(["employer", "admin"]),
  async (req, res) => {
    const jobs = await Job.find({ postedBy: (req.user as IUser)._id });
    const applications = await Application.find({
      jobId: { $in: jobs.map((j) => j._id) },
    }).sort({ createdAt: -1 });
    const applicantIds = applications.map(
      (application) => application.applicantId,
    );
    const applicants = await User.find({ _id: { $in: applicantIds } }).select(
      "avatar",
    );
    const applicantMap = new Map(
      applicants.map((applicant) => [String(applicant._id), applicant]),
    );
    // Enrich with job title for display
    const enriched = applications.map((a) => {
      const job = jobs.find((j) => String(j._id) === String(a.jobId));
      const applicant = applicantMap.get(String(a.applicantId));
      return {
        id: String(a._id),
        name: a.name,
        email: a.email,
        resumeLink: a.resumeLink,
        coverNote: a.coverNote,
        avatar: applicant?.avatar ?? "",
        role: job?.title ?? "Unknown Role",
        company: job?.company ?? "",
        appliedDate: new Date(
          (a as { createdAt: Date }).createdAt,
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: a.status,
      };
    });
    res.json(enriched);
  },
);

// PATCH /api/dashboard/applicants/:id/status
router.patch(
  "/applicants/:id/status",
  requireRole(["employer", "admin"]),
  async (req, res) => {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!application)
      return res.status(404).json({ message: "Application not found." });
    res.json(application);
  },
);

// POST /api/dashboard/jobs — create a new job listing
router.post(
  "/jobs",
  requireRole(["employer", "admin"]),
  [
    body("title").notEmpty().withMessage("Job title is required."),
    body("location").notEmpty().withMessage("Location is required."),
    body("employmentType")
      .notEmpty()
      .withMessage("Employment type is required."),
    body("description").notEmpty().withMessage("Description is required."),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const user = req.user as IUser;
    const {
      title,
      company,
      location,
      employmentType,
      description,
      tags,
      status,
    } = req.body;

    const job = await Job.create({
      title,
      company: company || user.company || "My Company",
      location,
      employmentType,
      description,
      tags: Array.isArray(tags)
        ? tags
        : tags
          ? String(tags)
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
      status: status ?? "Active",
      postedBy: user._id,
      applicantCount: 0,
    });

    res.status(201).json(job);
  },
);

// PATCH /api/dashboard/jobs/:id/status — close or reopen a job
router.patch(
  "/jobs/:id/status",
  requireRole(["employer", "admin"]),
  async (req: any, res: any) => {
    const job = await Job.findOne({
      _id: req.params["id"],
      postedBy: (req.user as IUser)._id,
    });
    if (!job) return res.status(404).json({ message: "Job not found." });
    job.status = req.body.status;
    await job.save();
    res.json(job);
  },
);

// GET /api/dashboard/profile — return employer profile
router.get(
  "/profile",
  requireRole(["employer", "admin"]),
  async (req: any, res: any) => {
    const user = await User.findById((req.user as IUser)._id).select(
      "-passwordHash",
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  },
);

// PUT /api/dashboard/profile — update employer profile & company logo
router.put(
  "/profile",
  requireRole(["employer", "admin"]),
  [body("email").optional().isEmail().withMessage("Invalid email address.")],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const allowed = [
      "name",
      "company",
      "companyLogo",
      "avatar",
      "industry",
      "website",
      "location",
      "companySize",
      "about",
      "phone",
    ] as const;
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    // Validate base64 image size (max 2 MB) to avoid bloating the DB
    if (
      typeof update["companyLogo"] === "string" &&
      update["companyLogo"].startsWith("data:")
    ) {
      const sizeBytes = Buffer.byteLength(
        update["companyLogo"] as string,
        "base64",
      );
      if (sizeBytes > 2 * 1024 * 1024) {
        return res
          .status(413)
          .json({ message: "Logo image must be under 2 MB." });
      }
    }

    const user = await User.findByIdAndUpdate(
      (req.user as IUser)._id,
      { $set: update },
      { new: true, runValidators: true },
    ).select("-passwordHash");

    res.json(user);
  },
);

export default router;
