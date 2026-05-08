import { Router } from "express";
import type { PipelineStage } from "mongoose";
import User from "../models/User";

const router = Router();

router.get("/", async (req, res) => {
  const page = Math.max(
    1,
    Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
  );
  const limitRaw = Number.parseInt(String(req.query.limit ?? "12"), 10);
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 12;
  const skip = (page - 1) * limit;

  const pipeline: PipelineStage[] = [
    { $match: { role: "employer" } },
    {
      $lookup: {
        from: "jobs",
        let: { employerId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postedBy", "$$employerId"] },
                  { $eq: ["$status", "Active"] },
                ],
              },
            },
          },
          { $project: { _id: 1 } },
        ],
        as: "activeJobs",
      },
    },
    { $addFields: { openRoles: { $size: "$activeJobs" } } },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: {
          $cond: [
            {
              $or: [{ $eq: ["$company", ""] }, { $eq: ["$company", null] }],
            },
            "Unknown Company",
            "$company",
          ],
        },
        industry: "$industry",
        location: "$location",
        companySize: "$companySize",
        about: "$about",
        companyLogo: "$companyLogo",
        openRoles: 1,
      },
    },
    { $sort: { openRoles: -1, name: 1 } as const },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        meta: [{ $count: "total" }],
      },
    },
  ];

  const [result] = await User.aggregate(pipeline);
  const companies = result?.data ?? [];
  const total = result?.meta?.[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  res.json({ companies, total, page, pageSize: limit, totalPages });
});

export default router;
