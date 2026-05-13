import { Router } from "express";
import mongoose from "mongoose";
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
  const RECOMMENDED_LIMIT = 4;
  const user = req.user as IUser;
  const userId = (user as { id?: string }).id;
  const rawApplicantId =
    typeof userId === "string" && userId ? userId : String(user._id ?? "");
  const applicantId =
    rawApplicantId && mongoose.Types.ObjectId.isValid(rawApplicantId)
      ? rawApplicantId
      : null;

  if (!applicantId) {
    return res.json({
      applicationsSubmitted: 0,
      recentApplications: 0,
      shortlisted: 0,
      pendingResponses: 0,
      recommendedJobs: [],
      applicationsTimeline: [],
    });
  }

  const [applications, activeJobs] = await Promise.all([
    Application.find({ applicantId }).sort({ createdAt: -1 }),
    Job.find({ status: "Active" })
      .sort({ createdAt: -1 })
      .limit(RECOMMENDED_LIMIT),
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
    recommendedJobs: activeJobs.slice(0, RECOMMENDED_LIMIT).map((job) => ({
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
