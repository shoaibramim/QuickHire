"use client";

// Messages page — /dashboard/messages

import { useEffect, useState } from "react";
import { useApiData } from "@/hooks/useApiData";
import { apiClient } from "@/services/apiClient";
import type { Message } from "@/types/dashboard";

type FilterTab = "All" | "Unread";

function MessageRow({
  msg,
  isSelected,
  onClick,
}: {
  msg: Message;
  isSelected: boolean;
  onClick: () => void;
}) {
  const initials = msg.from
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
          <p
            className={`text-sm truncate ${msg.unread ? "font-bold text-heading-dark" : "font-medium text-heading-dark"}`}
          >
            {msg.from}
          </p>
          <span className="text-xs text-subtitle flex-shrink-0">
            {msg.time}
          </span>
        </div>
        <p className="text-xs text-subtitle truncate">{msg.preview}</p>
      </div>
      {msg.unread && (
        <span
          className="w-2 h-2 rounded-full bg-brand-indigo flex-shrink-0 mt-1.5"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default function MessagesPage() {
  const [tab, setTab] = useState<FilterTab>("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { data, isLoading } = useApiData<Array<Message & { _id: string }>>(
    "/dashboard/messages",
  );
  // Map _id → id for MongoDB documents
  useEffect(() => {
    const mapped = (data ?? []).map((m) => ({ ...m, id: m._id }));
    setMessages(mapped);
  }, [data]);

  async function markAsRead(messageId: string) {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, unread: false } : msg,
      ),
    );
    try {
      await apiClient.patch(`/dashboard/messages/${messageId}/read`);
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, unread: true } : msg,
        ),
      );
    }
  }

  async function markAsUnread(messageId: string) {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, unread: true } : msg,
      ),
    );
    try {
      await apiClient.patch(`/dashboard/messages/${messageId}/unread`);
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, unread: false } : msg,
        ),
      );
    }
  }

  function handleSelect(message: Message) {
    setSelected(message.id);
    if (message.unread) {
      void markAsRead(message.id);
    }
  }

  function toggleUnread(message: Message) {
    if (message.unread) {
      void markAsRead(message.id);
    } else {
      void markAsUnread(message.id);
    }
  }

  const filtered =
    tab === "Unread" ? messages.filter((m) => m.unread) : messages;
  const selectedId = selected ?? messages[0]?.id ?? null;
  const selectedMsg = messages.find((m) => m.id === selectedId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-heading-dark">Messages</h1>

      <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm min-h-[500px]">
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
              <MessageRow
                key={msg.id}
                msg={msg}
                isSelected={selectedId === msg.id}
                onClick={() => handleSelect(msg)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-subtitle py-10">
                No messages
              </p>
            )}
          </div>
        </div>
        <div className="hidden sm:flex flex-1 flex-col">
          {selectedMsg ? (
            <>
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {selectedMsg.from
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-heading-dark">
                    {selectedMsg.from}
                  </p>
                  <p className="text-xs text-subtitle">{selectedMsg.time}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleUnread(selectedMsg)}
                  className="ml-auto text-xs font-semibold text-brand-indigo hover:underline"
                >
                  {selectedMsg.unread ? "Mark as read" : "Mark as unread"}
                </button>
              </div>
              <div className="flex-1 p-6">
                <p className="text-sm text-subtitle leading-relaxed">
                  {selectedMsg.preview}
                </p>
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
