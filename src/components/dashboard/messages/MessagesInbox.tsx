"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { io, type Socket } from "socket.io-client";

import { apiClient } from "@/services/apiClient";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import type {
  ConversationMessage,
  ConversationSummary,
} from "@/types/dashboard";

type FilterTab = "All" | "Unread";

const EDIT_WINDOW_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

function resolveSocketUrl() {
  if (API_BASE_URL.endsWith("/api/")) return API_BASE_URL.slice(0, -5);
  if (API_BASE_URL.endsWith("/api")) return API_BASE_URL.slice(0, -4);
  return API_BASE_URL;
}

function formatRelativeTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const diff = Date.now() - parsed.getTime();
  if (diff < MINUTE_MS) return "Just now";
  if (diff < HOUR_MS) return `${Math.floor(diff / MINUTE_MS)}m ago`;
  if (diff < DAY_MS) return `${Math.floor(diff / HOUR_MS)}h ago`;
  if (diff < 7 * DAY_MS) return `${Math.floor(diff / DAY_MS)}d ago`;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatExactTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function sortConversations(list: ConversationSummary[]) {
  return [...list].sort((a, b) => {
    const aTime = new Date(a.lastMessageAt).getTime();
    const bTime = new Date(b.lastMessageAt).getTime();
    return bTime - aTime;
  });
}

function notifyMessagesUpdated() {
  window.dispatchEvent(new Event("qh-messages-updated"));
}

export default function MessagesInbox() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const paramConversationId = searchParams.get("conversation");

  const [tab, setTab] = useState<FilterTab>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [composeMessage, setComposeMessage] = useState("");
  const [composeError, setComposeError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const lastConversationSyncRef = useRef<string | null>(null);
  const lastMessageSyncRef = useRef<Record<string, string>>({});

  const { data, isLoading } = useApiData<ConversationSummary[]>(
    "/dashboard/messages",
  );

  useEffect(() => {
    if (data) {
      const sorted = sortConversations(data);
      setConversations(sorted);
      const latest = sorted[0]?.lastMessageAt;
      if (latest) lastConversationSyncRef.current = latest;
    }
  }, [data]);

  useEffect(() => {
    if (!conversations.length) {
      setSelectedId(null);
      return;
    }

    if (
      paramConversationId &&
      conversations.some((c) => c.id === paramConversationId)
    ) {
      setSelectedId(paramConversationId);
      return;
    }

    if (selectedId && !conversations.some((c) => c.id === selectedId)) {
      setSelectedId(null);
    }
  }, [conversations, paramConversationId, selectedId]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  function getLatestConversationTimestamp(list: ConversationSummary[]) {
    return list.reduce<string | null>((latest, convo) => {
      if (!convo.lastMessageAt) return latest;
      if (!latest) return convo.lastMessageAt;
      return new Date(convo.lastMessageAt) > new Date(latest)
        ? convo.lastMessageAt
        : latest;
    }, null);
  }

  function getLatestMessageTimestamp(list: ConversationMessage[]) {
    return list.reduce<string | null>((latest, msg) => {
      if (!msg.createdAt) return latest;
      if (!latest) return msg.createdAt;
      return new Date(msg.createdAt) > new Date(latest)
        ? msg.createdAt
        : latest;
    }, null);
  }

  async function fetchConversationUpdates() {
    try {
      const since = lastConversationSyncRef.current;
      const query = since ? `?since=${encodeURIComponent(since)}` : "";
      const updates = await apiClient.get<ConversationSummary[]>(
        `/dashboard/messages${query}`,
      );
      if (!updates.length) return;

      setConversations((prev) => {
        const merged = new Map(prev.map((c) => [c.id, c]));
        updates.forEach((update) => merged.set(update.id, update));
        const next = sortConversations(Array.from(merged.values()));
        const latest = getLatestConversationTimestamp(next);
        if (latest) lastConversationSyncRef.current = latest;
        return next;
      });
    } catch {
      // Ignore incremental sync failures; next socket event will retry.
    }
  }

  async function fetchMessageUpdates(conversationId: string) {
    try {
      const since = lastMessageSyncRef.current[conversationId];
      const query = since ? `?since=${encodeURIComponent(since)}` : "";
      const updates = await apiClient.get<ConversationMessage[]>(
        `/dashboard/messages/${conversationId}${query}`,
      );
      if (!updates.length) return;

      setMessages((prev) => {
        const merged = new Map(prev.map((m) => [m.id, m]));
        updates.forEach((update) => merged.set(update.id, update));
        const next = Array.from(merged.values()).sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        const latest = getLatestMessageTimestamp(next);
        if (latest) lastMessageSyncRef.current[conversationId] = latest;
        return next;
      });
    } catch {
      // Ignore incremental sync failures; next socket event will retry.
    }
  }

  useEffect(() => {
    if (!user) return;

    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("qh_token") || localStorage.getItem("qh_token")
        : null;
    if (!token) return;

    const socket = io(resolveSocketUrl(), {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      void fetchConversationUpdates();
      const activeConversation = selectedIdRef.current;
      if (activeConversation) {
        void fetchMessageUpdates(activeConversation);
      }
    });

    socket.on("messages:updated", (payload: { conversationId?: string }) => {
      void fetchConversationUpdates();
      if (
        payload?.conversationId &&
        payload.conversationId === selectedIdRef.current
      ) {
        void fetchMessageUpdates(payload.conversationId);
      }
      notifyMessagesUpdated();
    });

    return () => {
      socket.off("messages:updated");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      setComposeMessage("");
      setComposeError(null);
      cancelEditing();
      return;
    }

    setComposeMessage("");
    setComposeError(null);
    cancelEditing();

    let cancelled = false;
    setLoadingMessages(true);
    apiClient
      .get<ConversationMessage[]>(`/dashboard/messages/${selectedId}`)
      .then((data) => {
        if (!cancelled) {
          setMessages(data);
          const latest = getLatestMessageTimestamp(data);
          if (latest) lastMessageSyncRef.current[selectedId] = latest;
        }
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const filtered = useMemo(() => {
    if (tab === "Unread") {
      return conversations.filter((c) => c.unreadCount > 0);
    }
    return conversations;
  }, [conversations, tab]);

  const selectedConversation = conversations.find((c) => c.id === selectedId);
  const hasUnread = (selectedConversation?.unreadCount ?? 0) > 0;

  async function markConversationReadById(
    conversationId: string,
    previousUnread: number,
  ) {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    );

    try {
      await apiClient.patch(`/dashboard/messages/${conversationId}/read`);
      notifyMessagesUpdated();
    } catch {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: previousUnread } : c,
        ),
      );
    }
  }

  async function markConversationRead() {
    if (!selectedConversation) return;
    await markConversationReadById(
      selectedConversation.id,
      selectedConversation.unreadCount,
    );
  }

  async function markConversationUnread() {
    if (!selectedConversation) return;
    const conversationId = selectedConversation.id;
    const previousUnread = selectedConversation.unreadCount;
    const incomingCount = user
      ? messages.filter((msg) => msg.senderId !== user.id).length
      : previousUnread;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: incomingCount } : c,
      ),
    );

    try {
      await apiClient.patch(`/dashboard/messages/${conversationId}/unread`);
      notifyMessagesUpdated();
    } catch {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: previousUnread } : c,
        ),
      );
    }
  }

  function handleSelectConversation(conversation: ConversationSummary) {
    setSelectedId(conversation.id);
    if (conversation.unreadCount > 0) {
      void markConversationReadById(conversation.id, conversation.unreadCount);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;

    const body = composeMessage.trim();
    if (!body) {
      setComposeError("Message cannot be empty.");
      return;
    }

    setSending(true);
    setComposeError(null);

    try {
      const created = await apiClient.post<ConversationMessage>(
        "/dashboard/messages",
        {
          conversationId: selectedId,
          message: body,
        },
      );
      setMessages((prev) => [...prev, created]);
      if (created.createdAt) {
        lastMessageSyncRef.current[selectedId] = created.createdAt;
      }
      setComposeMessage("");
      setConversations((prev) =>
        sortConversations(
          prev.map((c) =>
            c.id === selectedId
              ? {
                  ...c,
                  lastMessagePreview: created.body,
                  lastMessageAt: created.createdAt,
                }
              : c,
          ),
        ),
      );
      lastConversationSyncRef.current = created.createdAt;
      notifyMessagesUpdated();
    } catch {
      setComposeError("Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  function canEditMessage(message: ConversationMessage) {
    if (!user || message.senderId !== user.id) return false;
    const createdAt = new Date(message.createdAt).getTime();
    return Date.now() - createdAt <= EDIT_WINDOW_MS;
  }

  function startEditing(message: ConversationMessage) {
    setEditingId(message.id);
    setEditingBody(message.body);
    setEditError(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingBody("");
    setEditError(null);
  }

  async function saveEdit() {
    if (!editingId) return;
    const body = editingBody.trim();
    if (!body) {
      setEditError("Message cannot be empty.");
      return;
    }

    setSavingEdit(true);
    setEditError(null);

    try {
      const updated = await apiClient.patch<ConversationMessage>(
        `/dashboard/messages/entries/${editingId}`,
        { message: body },
      );

      setMessages((prev) => {
        const next = prev.map((msg) => (msg.id === updated.id ? updated : msg));
        const lastMessage = next[next.length - 1];
        if (lastMessage) {
          setConversations((prevConversations) =>
            sortConversations(
              prevConversations.map((c) =>
                c.id === selectedId
                  ? {
                      ...c,
                      lastMessagePreview: lastMessage.body,
                      lastMessageAt: lastMessage.createdAt,
                    }
                  : c,
              ),
            ),
          );
        }
        return next;
      });

      notifyMessagesUpdated();
      cancelEditing();
    } catch {
      setEditError("Failed to update message.");
    } finally {
      setSavingEdit(false);
    }
  }

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
            {filtered.map((conversation) => {
              const initials = conversation.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const avatarUrl = conversation.avatarUrl?.trim();
              const active = selectedId === conversation.id;
              return (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={[
                    "w-full flex items-start gap-3 p-4 text-left transition-colors border-b border-gray-50 last:border-0",
                    active ? "bg-indigo-50" : "hover:bg-gray-50",
                  ].join(" ")}
                >
                  <div className="w-10 h-10 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={conversation.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p
                        className={`text-sm truncate ${conversation.unreadCount > 0 ? "font-bold text-heading-dark" : "font-medium text-heading-dark"}`}
                      >
                        {conversation.displayName}
                      </p>
                      <span className="text-xs text-subtitle flex-shrink-0">
                        {formatRelativeTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-subtitle truncate">
                      {conversation.jobTitle}
                    </p>
                    <p className="text-xs text-subtitle truncate">
                      {conversation.lastMessagePreview}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span
                      className="w-2 h-2 rounded-full bg-brand-indigo flex-shrink-0 mt-1.5"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-subtitle py-10">
                No messages
              </p>
            )}
          </div>
        </div>
        <div className="hidden sm:flex flex-1 flex-col">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                  {selectedConversation.avatarUrl ? (
                    <img
                      src={selectedConversation.avatarUrl}
                      alt={selectedConversation.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedConversation.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-heading-dark">
                    {selectedConversation.displayName}
                  </p>
                  <p className="text-xs text-subtitle">
                    {selectedConversation.jobTitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={
                    hasUnread ? markConversationRead : markConversationUnread
                  }
                  className="ml-auto text-xs font-semibold text-brand-indigo hover:underline"
                >
                  {hasUnread ? "Mark as read" : "Mark as unread"}
                </button>
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full text-sm text-subtitle">
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-subtitle">
                    No messages yet. Say hello when you are ready.
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwn = message.senderId === user?.id;
                    const canEdit = canEditMessage(message);
                    const isEditing = editingId === message.id;
                    const timeClass = isOwn ? "text-white/80" : "text-subtitle";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${isOwn ? "bg-brand-indigo text-white" : "bg-gray-100 text-heading-dark"}`}
                        >
                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                rows={3}
                                value={editingBody}
                                onChange={(e) => setEditingBody(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-indigo resize-none"
                              />
                              {editError && (
                                <p className="text-xs text-red-500">
                                  {editError}
                                </p>
                              )}
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={cancelEditing}
                                  className="text-xs font-semibold text-subtitle hover:text-heading-dark"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={saveEdit}
                                  disabled={savingEdit}
                                  className="px-3 py-1.5 bg-brand-indigo text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                                >
                                  {savingEdit ? "Saving..." : "Save"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">
                              {message.body}
                            </p>
                          )}
                          {!isEditing && (
                            <div
                              className={`mt-2 flex items-center gap-2 text-[11px] ${timeClass}`}
                            >
                              <span>
                                {formatRelativeTime(message.createdAt)}
                              </span>
                              {message.editedAt && (
                                <span>
                                  edited at {formatExactTime(message.editedAt)}
                                </span>
                              )}
                              {canEdit && (
                                <button
                                  type="button"
                                  onClick={() => startEditing(message)}
                                  className={`ml-auto text-[11px] font-semibold underline ${isOwn ? "decoration-white/60" : "decoration-gray-400"}`}
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <form
                onSubmit={handleSend}
                className="px-6 py-4 border-t border-gray-100 space-y-2"
              >
                <textarea
                  rows={3}
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Write a message..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo resize-none"
                />
                {composeError && (
                  <p className="text-xs text-red-500">{composeError}</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-4 py-2 bg-brand-indigo text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-subtitle text-sm">
              Select a conversation to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
