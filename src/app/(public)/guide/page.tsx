import type { Metadata } from "next";
import ContentPageLayout from "@/components/ui/ContentPageLayout";

export const metadata: Metadata = {
  title: "Getting Started Guide — QuickHire",
  description: "Learn how to get the most out of QuickHire.",
};

const STEPS_JOB_SEEKER = [
  { step: "01", title: "Create Your Account", desc: "Sign in with your pre-authorised credentials. Once registered, complete your profile with your skills and experience." },
  { step: "02", title: "Browse Jobs", desc: "Explore listings by category, location, or keyword. Filter by employment type to find roles that fit your lifestyle." },
  { step: "03", title: "Apply with One Click", desc: "Found a great job? Click 'Apply Now' to submit your application directly to the employer through QuickHire." },
  { step: "04", title: "Track Your Applications", desc: "View all your applications in your Dashboard under 'My Applications'. Track statuses and respond to messages." },
];

const STEPS_EMPLOYER = [
  { step: "01", title: "Sign In as Employer", desc: "Access your employer dashboard after signing in. Your account type determines which features you can access." },
  { step: "02", title: "Post a Job", desc: "Click 'Post a Job' to create a listing. Add a clear job title, description, requirements, and employment type." },
  { step: "03", title: "Review Applications", desc: "Applicants will appear in your Applicants dashboard. Review profiles, shortlist candidates, and schedule interviews." },
  { step: "04", title: "Hire the Best", desc: "Use QuickHire's messaging and scheduling tools to communicate with candidates and make your final hire." },
];

export default function GuidePage() {
  return (
    <ContentPageLayout
      title="Getting Started Guide"
      subtitle="Whether you're looking for a job or hiring talent, this guide will get you up and running quickly."
    >
      <div className="not-prose space-y-12">
        <div>
          <h2 className="text-xl font-bold text-heading-dark mb-6">For Job Seekers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {STEPS_JOB_SEEKER.map((s) => (
              <div key={s.step} className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl">
                <span className="text-3xl font-extrabold text-indigo-100 flex-shrink-0">{s.step}</span>
                <div>
                  <p className="font-bold text-heading-dark mb-1">{s.title}</p>
                  <p className="text-sm text-subtitle leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-heading-dark mb-6">For Employers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {STEPS_EMPLOYER.map((s) => (
              <div key={s.step} className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl">
                <span className="text-3xl font-extrabold text-indigo-100 flex-shrink-0">{s.step}</span>
                <div>
                  <p className="font-bold text-heading-dark mb-1">{s.title}</p>
                  <p className="text-sm text-subtitle leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ContentPageLayout>
  );
}
