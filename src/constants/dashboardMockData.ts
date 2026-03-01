// Dashboard mock data — mirrors the shape of the Express API responses.
// TODO: Replace all exports with real GET /api/dashboard/* calls when backend is ready.

import type {
  DashboardOverview,
  Message,
  Applicant,
  DashboardJob,
  ScheduleEvent,
  SidebarNavItem,
} from "@/types/dashboard";

// ── Sidebar navigation ────────────────────────────────────────
export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { label: "Dashboard",      href: "/dashboard",              iconKey: "dashboard" },
  { label: "Messages",       href: "/dashboard/messages",     iconKey: "messages",  badge: 1 },
  { label: "Company Profile",href: "/dashboard/profile",      iconKey: "profile" },
  { label: "All Applicants", href: "/dashboard/applicants",   iconKey: "applicants" },
  { label: "Job Listing",    href: "/dashboard/job-listing",  iconKey: "jobs" },
  { label: "My Schedule",    href: "/dashboard/schedule",     iconKey: "schedule" },
];

export const SIDEBAR_SETTINGS_ITEMS: SidebarNavItem[] = [
  { label: "Settings",    href: "/dashboard/settings", iconKey: "settings" },
  { label: "Help Center", href: "/dashboard/help",     iconKey: "help" },
];

// ── Dashboard overview ────────────────────────────────────────
// TODO: GET /api/dashboard/overview
export const DASHBOARD_OVERVIEW: DashboardOverview = {
  newCandidates: 76,
  scheduledToday: 3,
  messages: 24,
  jobsOpen: 12,
  totalApplicants: 67,
  weeklyStats: {
    jobViews: 2342,
    jobViewsTrend: 6.4,
    jobApplied: 654,
    jobAppliedTrend: -0.5,
  },
  chartData: [
    { day: "Mon", jobViews: 80,  jobApplied: 22 },
    { day: "Tue", jobViews: 95,  jobApplied: 28 },
    { day: "Wed", jobViews: 110, jobApplied: 34 },
    { day: "Thu", jobViews: 75,  jobApplied: 18 },
    { day: "Fri", jobViews: 122, jobApplied: 34 },
    { day: "Sat", jobViews: 65,  jobApplied: 15 },
    { day: "Sun", jobViews: 50,  jobApplied: 12 },
  ],
  applicantBreakdown: [
    { label: "Full Time",  count: 45, color: "bg-brand-indigo" },
    { label: "Part-Time",  count: 24, color: "bg-amber-400" },
    { label: "Internship", count: 32, color: "bg-blue-400" },
    { label: "Contract",   count: 30, color: "bg-pink-400" },
    { label: "Remote",     count: 22, color: "bg-green-400" },
  ],
};

// ── Messages ──────────────────────────────────────────────────
// TODO: GET /api/dashboard/messages
export const MOCK_MESSAGES: Message[] = [
  { id: "msg-1", from: "Jake Harrington",  preview: "Hi, I reviewed your application and would love to…", time: "2h ago",  unread: true },
  { id: "msg-2", from: "Sarah Kim",        preview: "Thank you for applying! We'd like to schedule…",     time: "4h ago",  unread: false },
  { id: "msg-3", from: "Tom Nguyen",       preview: "Hey, just following up on the interview we…",        time: "1d ago",  unread: false },
  { id: "msg-4", from: "Lucy Zhao",        preview: "The position has been filled. Thank you for…",       time: "2d ago",  unread: false },
  { id: "msg-5", from: "Marco Rossi",      preview: "Can you please send over your portfolio link?",       time: "3d ago",  unread: false },
];

// ── Applicants ────────────────────────────────────────────────
// TODO: GET /api/dashboard/applicants
export const MOCK_APPLICANTS: Applicant[] = [
  { id: "app-1", name: "Alice Nguyen",   role: "Brand Designer",       company: "Dropbox",   appliedDate: "Feb 28, 2026", status: "Shortlisted" },
  { id: "app-2", name: "Carlos Mendez", role: "Email Marketing",      company: "Revolut",   appliedDate: "Feb 27, 2026", status: "Reviewed" },
  { id: "app-3", name: "Priya Singh",   role: "Product Designer",      company: "ClassPass", appliedDate: "Feb 26, 2026", status: "Pending" },
  { id: "app-4", name: "Liam O'Brien",  role: "Visual Designer",       company: "Blinklist", appliedDate: "Feb 25, 2026", status: "Rejected" },
  { id: "app-5", name: "Yuki Tanaka",   role: "Lead Designer",         company: "Canva",     appliedDate: "Feb 24, 2026", status: "Shortlisted" },
  { id: "app-6", name: "Sofia Adams",   role: "Brand Strategist",      company: "GoDaddy",   appliedDate: "Feb 23, 2026", status: "Reviewed" },
  { id: "app-7", name: "Ethan Brooks",  role: "Data Analyst",          company: "Twitter",   appliedDate: "Feb 22, 2026", status: "Pending" },
  { id: "app-8", name: "Mia Chen",      role: "Social Media Assistant",company: "Nomad",     appliedDate: "Feb 21, 2026", status: "Reviewed" },
];

// ── Job listings ──────────────────────────────────────────────
// TODO: GET /api/dashboard/jobs
export const MOCK_DASHBOARD_JOBS: DashboardJob[] = [
  { id: "dj-1", title: "Email Marketing",       company: "Revolut",   postedDate: "Feb 20, 2026", applicants: 14, status: "Active" },
  { id: "dj-2", title: "Brand Designer",         company: "Dropbox",   postedDate: "Feb 18, 2026", applicants: 9,  status: "Active" },
  { id: "dj-3", title: "Product Designer",       company: "ClassPass", postedDate: "Feb 15, 2026", applicants: 22, status: "Active" },
  { id: "dj-4", title: "Visual Designer",         company: "Blinklist", postedDate: "Feb 10, 2026", applicants: 7,  status: "Closed" },
  { id: "dj-5", title: "Brand Strategist",       company: "GoDaddy",   postedDate: "Feb 8, 2026",  applicants: 5,  status: "Draft" },
];

// ── Schedule ──────────────────────────────────────────────────
// TODO: GET /api/dashboard/schedule
export const MOCK_SCHEDULE: ScheduleEvent[] = [
  { id: "sch-1", title: "Interview: Alice Nguyen",   time: "10:00 AM", date: "Mar 2, 2026",  type: "Interview",  withPerson: "Alice Nguyen" },
  { id: "sch-2", title: "Team Sync",                  time: "2:00 PM",  date: "Mar 2, 2026",  type: "Meeting" },
  { id: "sch-3", title: "Resume Review",               time: "9:30 AM",  date: "Mar 3, 2026",  type: "Review" },
  { id: "sch-4", title: "Interview: Yuki Tanaka",     time: "11:00 AM", date: "Mar 4, 2026",  type: "Interview",  withPerson: "Yuki Tanaka" },
  { id: "sch-5", title: "Quarterly Planning",          time: "3:00 PM",  date: "Mar 5, 2026",  type: "Meeting" },
];
