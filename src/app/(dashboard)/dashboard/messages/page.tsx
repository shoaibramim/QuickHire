"use client";

// Messages page — /dashboard/messages

import Link from "next/link";
import { useState } from "react";
import { useApiData } from "@/hooks/useApiData";
import type { Message } from "@/types/dashboard";

type FilterTab = "All" | "Unread";

function MessageRow({ msg, isSelected, onClick }: { msg: Message; isSelected: boolean; onClick: () => void }) {
  const initials = msg.from.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-start gap-3 p-4 text-left transition-colors border-b border-gray-50 last:border-0",
        isSelected ? "bg-indigo-50" : "hover:bg-gray-50",
      ].join(" ")}
    >
      <div className="w-10 h-10 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className={`text-sm truncate ${msg.unread ? "font-bold text-heading-dark" : "font-medium text-heading-dark"}`}>
            {msg.from}
          </p>
          <span className="text-xs text-subtitle flex-shrink-0">{msg.time}</span>
        </div>
        <p className="text-xs text-subtitle truncate">{msg.preview}</p>
      </div>
      {msg.unread && <span className="w-2 h-2 rounded-full bg-brand-indigo flex-shrink-0 mt-1.5" aria-hidden="true" />}
    </button>
  );
}

export default function MessagesPage() {
  const [tab, setTab] = useState<FilterTab>("All");
  const [selected, setSelected] = useState<string | null>(null);

  const { data, isLoading } = useApiData<Array<Message & { _id: string }>>("/dashboard/messages");
  // Map _id → id for MongoDB documents
  const allMessages: Message[] = (data ?? []).map((m) => ({ ...m, id: m._id }));

  const filtered = tab === "Unread" ? allMessages.filter((m) => m.unread) : allMessages;
  const selectedId = selected ?? allMessages[0]?.id ?? null;
  const selectedMsg = allMessages.find((m) => m.id === selectedId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-heading-dark">Messages</h1>

      <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm min-h-[500px]">
        {/* Inbox */}
        <div className="w-full sm:w-80 md:w-72 lg:w-80 border-r border-gray-100 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(["All", "Unread"] as FilterTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${tab === t ? "bg-white text-heading-dark shadow-sm" : "text-subtitle hover:text-heading-dark"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((msg) => (
            <MessageRow key={msg.id} msg={msg} isSelected={selectedId === msg.id} onClick={() => setSelected(msg.id)} />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-subtitle py-10">No messages</p>
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className="hidden sm:flex flex-1 flex-col">
          {selectedMsg ? (
            <>
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {selectedMsg.from.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-heading-dark">{selectedMsg.from}</p>
                  <p className="text-xs text-subtitle">{selectedMsg.time}</p>
                </div>
              </div>
              <div className="flex-1 p-6">
                <p className="text-sm text-subtitle leading-relaxed">{selectedMsg.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
              </div>
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a reply…"
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                  />
                  <button className="px-4 py-2.5 bg-brand-indigo text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-subtitle text-sm">
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
