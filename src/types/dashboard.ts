// Dashboard-related TypeScript types
// TODO: Replace mock shapes with actual API response types from Express backend

export interface DashboardStat {
  label: string;
  value: number;
  href: string;
}

export interface ChartDataPoint {
  day: string;
  jobViews: number;
  jobApplied: number;
}

export interface ApplicantBreakdownItem {
  label: string;
  count: number;
  /** Tailwind bg colour class */
  color: string;
}

export interface DashboardOverview {
  newCandidates: number;
  scheduledToday: number;
  messages: number;
  jobsOpen: number;
  totalApplicants: number;
  weeklyStats: {
    jobViews: number;
    jobViewsTrend: number; // % change, positive = up
    jobApplied: number;
    jobAppliedTrend: number;
  };
  chartData: ChartDataPoint[];
  applicantBreakdown: ApplicantBreakdownItem[];
}

export interface Message {
  id: string;
  from: string;
  avatar?: string;
  preview: string;
  time: string;
  unread: boolean;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  resumeLink: string;
  coverNote: string;
  role: string;
  company: string;
  appliedDate: string;
  status: "Reviewed" | "Shortlisted" | "Rejected" | "Pending";
  avatar?: string;
}

export interface DashboardJob {
  id: string;
  title: string;
  company: string;
  postedDate: string;
  applicants: number;
  status: "Active" | "Closed" | "Draft";
}

export interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  type: "Interview" | "Meeting" | "Review";
  withPerson?: string;
}

export type SidebarNavItem = {
  label: string;
  href: string;
  iconKey: SidebarIconKey;
  badge?: number;
};

export type SidebarIconKey =
  | "dashboard"
  | "messages"
  | "profile"
  | "applicants"
  | "jobs"
  | "schedule"
  | "settings"
  | "help";
