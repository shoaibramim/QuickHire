/**
 * POST /api/jobs/:id/apply
 *
 * Accepts an application for a job.
 * Model: Application(id, job_id, name, email, resume_link, cover_note, created_at)
 *
 *   await db.collection("applications").insertOne({ ... })
 *   or: await prisma.application.create({ data: { ... } })
 */

import { NextRequest, NextResponse } from "next/server";
const applicationsStore: Array<{
  id: string;
  job_id: string;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  created_at: string;
}> = [];

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { id: job_id } = await context.params;

  let body: { name?: string; email?: string; resume_link?: string; cover_note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, resume_link, cover_note } = body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "A valid full name is required." }, { status: 422 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 422 });
  }
  if (!resume_link || typeof resume_link !== "string" || resume_link.trim().length < 5) {
    return NextResponse.json({ error: "A resume link (URL or path) is required." }, { status: 422 });
  }
  const application = {
    id: crypto.randomUUID(),
    job_id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    resume_link: resume_link.trim(),
    cover_note: (cover_note ?? "").trim(),
    created_at: new Date().toISOString(),
  };
  applicationsStore.push(application);

  // Dev log so you can see submissions in the terminal
  console.log("[Apply API] New application received:", application);

  return NextResponse.json(
    { success: true, message: "Application submitted successfully!", id: application.id },
    { status: 201 }
  );
}

// GET — dev helper to inspect stored applications
export async function GET(_req: NextRequest, context: RouteContext) {
  const { id: job_id } = await context.params;
  const jobApplications = applicationsStore.filter((a) => a.job_id === job_id);
  return NextResponse.json({ job_id, count: jobApplications.length, applications: jobApplications });
}
