import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import Application from "../models/Application";
import Job from "../models/Job";
import { IUser } from "../models/User";

const router = Router();
router.use(requireAuth, requireRole(["jobseeker", "admin"]));

function formatDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

router.get("/overview", async (req, res) => {
  const user = req.user as IUser;
  const userEmail = user.email.toLowerCase();

  const [applications, activeJobs] = await Promise.all([
    Application.find({ email: userEmail }).sort({ createdAt: -1 }),
    Job.find({ status: "Active" }).sort({ createdAt: -1 }).limit(8),
  ]);

  const applicationsWithJobs = await Promise.all(
    applications.slice(0, 6).map(async (application) => {
      const job = await Job.findById(application.jobId);
      return {
        id: String(application._id),
        jobId: String(application.jobId),
        title: job?.title ?? "Application",
        company: job?.company ?? "QuickHire",
        status: application.status,
        appliedDate: formatDate(
          new Date((application as { createdAt: Date }).createdAt),
        ),
        href: job ? `/jobs/${job._id}` : "/jobs",
      };
    }),
  );

  const recentApplicationCount = applications.filter((application) => {
    const created = new Date((application as { createdAt: Date }).createdAt);
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    return created >= last30Days;
  }).length;

  res.json({
    applicationsSubmitted: applications.length,
    recentApplications: recentApplicationCount,
    shortlisted: applications.filter(
      (application) => application.status === "Shortlisted",
    ).length,
    pendingResponses: applications.filter(
      (application) => application.status === "Pending",
    ).length,
    recommendedJobs: activeJobs.slice(0, 6).map((job) => ({
      id: String(job._id),
      title: job.title,
      company: job.company,
      location: job.location,
      employmentType: job.employmentType,
      href: `/jobs/${job._id}`,
      featured: job.featured ?? false,
    })),
    applicationsTimeline: applicationsWithJobs,
  });
});

export default router;
