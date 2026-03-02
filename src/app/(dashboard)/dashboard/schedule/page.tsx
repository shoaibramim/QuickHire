"use client";

// My Schedule page — /dashboard/schedule

import { useApiData } from "@/hooks/useApiData";
import type { ScheduleEvent } from "@/types/dashboard";

const EVENT_COLORS: Record<ScheduleEvent["type"], string> = {
  Interview: "bg-indigo-50 border-l-brand-indigo text-brand-indigo",
  Meeting:   "bg-blue-50   border-l-blue-400   text-blue-600",
  Review:    "bg-amber-50  border-l-amber-400  text-amber-600",
};

const EVENT_DOT: Record<ScheduleEvent["type"], string> = {
  Interview: "bg-brand-indigo",
  Meeting:   "bg-blue-400",
  Review:    "bg-amber-400",
};

// Group events by date
function groupByDate(events: ScheduleEvent[]) {
  const map: Record<string, ScheduleEvent[]> = {};
  events.forEach((e) => {
    if (!map[e.date]) map[e.date] = [];
    map[e.date].push(e);
  });
  return map;
}

export default function SchedulePage() {
  const { data, isLoading } = useApiData<Array<ScheduleEvent & { _id: string }>>("/dashboard/schedule");
  // Map _id → id for MongoDB documents
  const events: ScheduleEvent[] = (data ?? []).map((e) => ({ ...e, id: e._id }));
  const grouped = groupByDate(events);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-heading-dark">My Schedule</h1>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-indigo text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Event
        </button>
      </div>

      {Object.entries(grouped).map(([date, events]) => (
        <div key={date} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-subtitle">{date}</h2>
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className={`flex items-center gap-4 bg-white border border-gray-100 border-l-4 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow ${EVENT_COLORS[event.type].split(" ").slice(1).join(" ")}`}
                style={{ borderLeftColor: event.type === "Interview" ? "#4f46e5" : event.type === "Meeting" ? "#60a5fa" : "#fbbf24" }}
              >
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${EVENT_DOT[event.type]}`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-heading-dark">{event.title}</p>
                  {event.withPerson && (
                    <p className="text-xs text-subtitle mt-0.5">with {event.withPerson}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-heading-dark">{event.time}</p>
                  <p className="text-xs text-subtitle mt-0.5">{event.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
