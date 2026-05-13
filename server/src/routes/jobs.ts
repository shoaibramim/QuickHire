import { Router } from "express";
import mongoose from "mongoose";
import Job from "../models/Job";
import Application from "../models/Application";
import JobView from "../models/JobView";
import { requireAuth, requireRole } from "../middleware/auth";
import { IUser } from "../models/User";

const router = Router();

function resolveApplicantId(user: IUser): string | null {
  const userId = (user as { id?: string }).id;
  const rawId =
    typeof userId === "string" && userId ? userId : String(user._id ?? "");

  if (!rawId || !mongoose.Types.ObjectId.isValid(rawId)) return null;
  return rawId;
}

/**
 * Attach the employer's real uploaded logo (if any) to the job payload.
 * If the user has set a companyLogo (base64 / URL) on their profile it takes
 * precedence over the static companyLogoKey stored on the job document.
 */
function withLogo(job: InstanceType<typeof Job>): Record<string, unknown> {
  const obj = job.toObject() as unknown as Record<string, unknown> & {
    postedBy?: { companyLogo?: string };
  };
  const uploadedLogo = obj.postedBy?.companyLogo;
  if (uploadedLogo) obj.companyLogoKey = uploadedLogo;
  delete obj.postedBy; // never expose the user sub-document
  return obj;
}

function buildJobFilter(
  query: Record<string, unknown>,
): Record<string, unknown> {
  const filter: Record<string, unknown> = { status: "Active" };
  const q = typeof query.q === "string" ? query.q : undefined;
  const category =
    typeof query.category === "string" ? query.category : undefined;
  const location =
    typeof query.location === "string" ? query.location : undefined;
  const company = typeof query.company === "string" ? query.company : undefined;
  const type = typeof query.type === "string" ? query.type : undefined;
  const featured =
    typeof query.featured === "string" ? query.featured : undefined;

  if (q) filter.title = { $regex: q, $options: "i" };
  if (category) filter.tags = category;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (company) filter.company = { $regex: company, $options: "i" };
  if (type) filter.employmentType = type;
  if (featured === "true") filter.featured = true;

  return filter;
}

// GET /api/jobs                — public job board (with ?category, ?q, ?location, ?type, ?featured filters)
router.get("/", async (req, res) => {
  const filter = buildJobFilter(req.query as Record<string, unknown>);
  const page = Math.max(
    1,
    Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
  );
  const limitRaw = Number.parseInt(String(req.query.limit ?? "12"), 10);
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 12;
  const skip = (page - 1) * limit;
  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("postedBy", "companyLogo");
  res.json(jobs.map(withLogo));
});

// GET /api/jobs/featured       — landing page: latest 8 jobs with featured: true
router.get("/featured", async (_req, res) => {
  const jobs = await Job.find({ status: "Active", featured: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate("postedBy", "companyLogo");
  res.json(jobs.map(withLogo));
});

// GET /api/jobs/latest         — landing page: latest 10 jobs (regardless of featured)
router.get("/latest", async (_req, res) => {
  const jobs = await Job.find({ status: "Active" })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("postedBy", "companyLogo");
  res.json(jobs.map(withLogo));
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

// GET /api/jobs/count         — total matching jobs for filters
router.get("/count", async (req, res) => {
  const filter = buildJobFilter(req.query as Record<string, unknown>);
  const total = await Job.countDocuments(filter);
  res.json({ total });
});

// GET /api/jobs/:id/application-status — check if a job seeker already applied
router.get(
  "/:id/application-status",
  requireAuth,
  requireRole(["jobseeker", "admin"]),
  async (req, res) => {
    const user = req.user as IUser;
    const applicantId = resolveApplicantId(user);
    if (!applicantId) return res.json({ applied: false });

    const existing = await Application.findOne({
      jobId: req.params.id,
      applicantId,
    });

    if (!existing) return res.json({ applied: false });

    res.json({
      applied: true,
      status: existing.status,
      appliedDate: new Date(
        (existing as { createdAt: Date }).createdAt,
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
  },
);

// GET /api/jobs/:id            — single job detail page
router.get("/:id", async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $inc: { jobViews: 1 } },
    { new: true },
  ).populate("postedBy", "companyLogo");
  if (!job) return res.status(404).json({ message: "Job not found." });
  try {
    await JobView.create({ jobId: job._id });
  } catch {
    // Ignore logging errors to avoid blocking the job detail response.
  }
  res.json(withLogo(job));
});

// POST /api/jobs/:id/apply     — replaces the Next.js route handler in app/api/jobs/[id]/apply/route.ts
router.post(
  "/:id/apply",
  requireAuth,
  requireRole(["jobseeker", "admin"]),
  async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job || job.status !== "Active")
      return res.status(404).json({ message: "Job not found or closed." });

    const user = req.user as IUser;
    const { resume_link, cover_note } = req.body;
    const applicantName = (user.name ?? "").trim();
    const applicantEmail = (user.email ?? "").trim().toLowerCase();
    const applicantId = resolveApplicantId(user);

    if (!applicantId || !applicantName || !applicantEmail || !resume_link) {
      return res
        .status(422)
        .json({ message: "name, email, and resume_link are required." });
    }

    try {
      const url = new URL(resume_link);
      if (url.protocol !== "http:" && url.protocol !== "https:")
        throw new Error();
    } catch {
      return res.status(422).json({
        error:
          "Please provide a valid resume link (must start with http:// or https://).",
      });
    }

    const existing = await Application.findOne({
      jobId: job._id,
      applicantId,
    });
    if (existing) {
      return res.status(409).json({
        message: "You have already applied to this job.",
        status: existing.status,
      });
    }

    const application = await Application.create({
      applicantId,
      jobId: job._id,
      name: applicantName,
      email: applicantEmail,
      resumeLink: resume_link,
      coverNote: cover_note ?? "",
    });
    await Job.findByIdAndUpdate(job._id, { $inc: { applicantCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      id: application._id,
    });
  },
);

// POST /api/jobs               — employer posts a new job (protected)
router.post(
  "/",
  requireAuth,
  requireRole(["employer", "admin"]),
  async (req, res) => {
    const job = await Job.create({
      ...req.body,
      postedBy: (req.user as { _id: string })._id,
    });
    res.status(201).json(job);
  },
);

export default router;
