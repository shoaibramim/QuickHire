import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth, requireRole } from "../middleware/auth";
import Application from "../models/Application";
import Conversation, { IConversation } from "../models/Conversation";
import Job from "../models/Job";
import Message, { IMessage } from "../models/Message";
import User, { IUser } from "../models/User";

const router = Router();
router.use(requireAuth);

const PREVIEW_LIMIT = 140;
const EDIT_WINDOW_MS = 60 * 60 * 1000;

function resolveUserId(user: IUser): string | null {
  const userId = (user as { id?: string }).id;
  const rawId =
    typeof userId === "string" && userId ? userId : String(user._id ?? "");
  if (!rawId || !mongoose.Types.ObjectId.isValid(rawId)) return null;
  return rawId;
}

function isValidObjectId(value: string) {
  return mongoose.Types.ObjectId.isValid(value);
}

function buildPreview(message: string) {
  return message.length > PREVIEW_LIMIT
    ? `${message.slice(0, PREVIEW_LIMIT - 3)}...`
    : message;
}

function serializeMessage(doc: IMessage) {
  return {
    id: String(doc._id),
    senderId: String(doc.senderId),
    body: doc.body,
    createdAt: doc.createdAt,
    editedAt: doc.editedAt ?? null,
  };
}

function ensureMessagingRole(user: IUser) {
  return ["employer", "jobseeker", "admin"].includes(user.role);
}

function isConversationParticipant(
  conversation: IConversation,
  userId: string,
) {
  return (
    String(conversation.employerId) === userId ||
    String(conversation.jobSeekerId) === userId
  );
}

// GET /api/dashboard/messages — list conversation summaries
router.get("/", async (req, res) => {
  const user = req.user as IUser;
  if (!ensureMessagingRole(user)) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const userId = resolveUserId(user);
  if (!userId) return res.json([]);

  const role = user.role;
  const filter =
    role === "employer"
      ? { employerId: userId }
      : role === "jobseeker"
        ? { jobSeekerId: userId }
        : { $or: [{ employerId: userId }, { jobSeekerId: userId }] };

  const conversations = await Conversation.find(filter).sort({
    lastMessageAt: -1,
    updatedAt: -1,
  });

  const isEmployerView = role === "employer";
  const counterpartIds = conversations.map((conversation) =>
    isEmployerView ? conversation.jobSeekerId : conversation.employerId,
  );
  const counterpartUsers = await User.find({
    _id: { $in: counterpartIds },
  }).select("avatar companyLogo");
  const counterpartMap = new Map(
    counterpartUsers.map((counterpart) => [
      String(counterpart._id),
      counterpart,
    ]),
  );

  const summaries = await Promise.all(
    conversations.map(async (conversation) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conversation._id,
        recipientId: userId,
        unread: true,
      });
      const displayName = isEmployerView
        ? conversation.jobSeekerName
        : conversation.companyName;
      const counterpartId = String(
        isEmployerView ? conversation.jobSeekerId : conversation.employerId,
      );
      const counterpart = counterpartMap.get(counterpartId);
      const avatarUrl = isEmployerView
        ? counterpart?.avatar
        : counterpart?.companyLogo || counterpart?.avatar;
      return {
        id: String(conversation._id),
        displayName,
        jobTitle: conversation.jobTitle,
        lastMessagePreview: conversation.lastMessagePreview ?? "",
        lastMessageAt: conversation.lastMessageAt ?? conversation.createdAt,
        unreadCount,
        avatarUrl: avatarUrl ?? null,
      };
    }),
  );

  res.json(summaries);
});

// GET /api/dashboard/messages/:conversationId — list messages for a conversation
router.get("/:conversationId", async (req, res) => {
  const user = req.user as IUser;
  if (!ensureMessagingRole(user)) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const userId = resolveUserId(user);
  if (!userId) return res.status(401).json({ message: "Unauthorized." });

  if (!isValidObjectId(req.params.conversationId)) {
    return res.status(422).json({ message: "Invalid conversation id." });
  }

  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found." });
  }
  if (!isConversationParticipant(conversation, userId)) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const messages = await Message.find({
    conversationId: conversation._id,
  }).sort({
    createdAt: 1,
  });
  res.json(messages.map(serializeMessage));
});

// POST /api/dashboard/messages/start — employer initiates a conversation
router.post("/start", requireRole(["employer", "admin"]), async (req, res) => {
  const user = req.user as IUser;
  const userId = resolveUserId(user);
  if (!userId) return res.status(401).json({ message: "Unauthorized." });

  const applicationId = String(req.body.applicationId ?? "").trim();
  const messageBody = String(req.body.message ?? "").trim();
  if (!applicationId || !messageBody) {
    return res
      .status(422)
      .json({ message: "applicationId and message are required." });
  }

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(422).json({ message: "Invalid application id." });
  }

  const application = await Application.findById(applicationId);
  if (!application)
    return res.status(404).json({ message: "Application not found." });

  const job = await Job.findById(application.jobId);
  if (!job) return res.status(404).json({ message: "Job not found." });

  if (String(job.postedBy) !== userId) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const jobSeekerId = String(application.applicantId);
  const jobTitle = job.title;
  const companyName = job.company || user.company || user.name || "Hiring team";

  let conversation = await Conversation.findOne({
    applicationId: application._id,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      applicationId: application._id,
      jobId: job._id,
      employerId: userId,
      jobSeekerId,
      jobTitle,
      companyName,
      jobSeekerName: application.name,
    });
  }

  const created = await Message.create({
    conversationId: conversation._id,
    senderId: userId,
    recipientId: jobSeekerId,
    body: messageBody,
    preview: buildPreview(messageBody),
    unread: true,
  });

  conversation.lastMessageAt = created.createdAt;
  conversation.lastMessagePreview = created.preview;
  conversation.lastMessageId = created._id;
  await conversation.save();

  res.status(201).json({
    conversationId: String(conversation._id),
    message: serializeMessage(created),
  });
});

// POST /api/dashboard/messages — reply in an existing conversation
router.post("/", async (req, res) => {
  const user = req.user as IUser;
  if (!ensureMessagingRole(user)) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const userId = resolveUserId(user);
  if (!userId) return res.status(401).json({ message: "Unauthorized." });

  const conversationId = String(req.body.conversationId ?? "").trim();
  const messageBody = String(req.body.message ?? "").trim();
  if (!conversationId || !messageBody) {
    return res
      .status(422)
      .json({ message: "conversationId and message are required." });
  }

  if (!isValidObjectId(conversationId)) {
    return res.status(422).json({ message: "Invalid conversation id." });
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found." });
  }
  if (!isConversationParticipant(conversation, userId)) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const recipientId =
    String(conversation.employerId) === userId
      ? String(conversation.jobSeekerId)
      : String(conversation.employerId);

  const created = await Message.create({
    conversationId: conversation._id,
    senderId: userId,
    recipientId,
    body: messageBody,
    preview: buildPreview(messageBody),
    unread: true,
  });

  conversation.lastMessageAt = created.createdAt;
  conversation.lastMessagePreview = created.preview;
  conversation.lastMessageId = created._id;
  await conversation.save();

  res.status(201).json(serializeMessage(created));
});

// PATCH /api/dashboard/messages/:conversationId/read — mark all as read
router.patch("/:conversationId/read", async (req, res) => {
  const user = req.user as IUser;
  if (!ensureMessagingRole(user)) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const userId = resolveUserId(user);
  if (!userId) return res.status(401).json({ message: "Unauthorized." });

  if (!isValidObjectId(req.params.conversationId)) {
    return res.status(422).json({ message: "Invalid conversation id." });
  }

  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found." });
  }
  if (!isConversationParticipant(conversation, userId)) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const result = await Message.updateMany(
    { conversationId: conversation._id, recipientId: userId, unread: true },
    { unread: false },
  );

  const updatedCount =
    "modifiedCount" in result
      ? result.modifiedCount
      : "nModified" in result
        ? ((result as { nModified?: number }).nModified ?? 0)
        : 0;

  res.json({ updated: updatedCount });
});

// PATCH /api/dashboard/messages/:conversationId/unread — mark all as unread
router.patch("/:conversationId/unread", async (req, res) => {
  const user = req.user as IUser;
  if (!ensureMessagingRole(user)) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const userId = resolveUserId(user);
  if (!userId) return res.status(401).json({ message: "Unauthorized." });

  if (!isValidObjectId(req.params.conversationId)) {
    return res.status(422).json({ message: "Invalid conversation id." });
  }

  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found." });
  }
  if (!isConversationParticipant(conversation, userId)) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const result = await Message.updateMany(
    { conversationId: conversation._id, recipientId: userId },
    { unread: true },
  );

  const updatedCount =
    "modifiedCount" in result
      ? result.modifiedCount
      : "nModified" in result
        ? ((result as { nModified?: number }).nModified ?? 0)
        : 0;

  res.json({ updated: updatedCount });
});

// PATCH /api/dashboard/messages/entries/:messageId — edit a message within 1 hour
router.patch("/entries/:messageId", async (req, res) => {
  const user = req.user as IUser;
  if (!ensureMessagingRole(user)) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const userId = resolveUserId(user);
  if (!userId) return res.status(401).json({ message: "Unauthorized." });

  const messageBody = String(req.body.message ?? "").trim();
  if (!messageBody) {
    return res.status(422).json({ message: "message is required." });
  }

  const message = await Message.findById(req.params.messageId);
  if (!message) return res.status(404).json({ message: "Message not found." });

  if (String(message.senderId) !== userId) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const createdAt = new Date(message.createdAt).getTime();
  if (Date.now() - createdAt > EDIT_WINDOW_MS) {
    return res
      .status(403)
      .json({ message: "Message can no longer be edited." });
  }

  message.body = messageBody;
  message.preview = buildPreview(messageBody);
  message.editedAt = new Date();
  await message.save();

  const conversation = await Conversation.findById(message.conversationId);
  if (
    conversation &&
    String(conversation.lastMessageId) === String(message._id)
  ) {
    conversation.lastMessagePreview = message.preview;
    await conversation.save();
  }

  res.json(serializeMessage(message));
});

export default router;
