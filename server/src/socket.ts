import http from "http";
import jwt from "jsonwebtoken";
import { Server, type Socket } from "socket.io";
import User from "./models/User";

let io: Server | null = null;

function normalizeOrigin(origin?: string) {
  if (!origin) return "*";
  return origin.split(",").map((value) => value.trim());
}

function resolveToken(rawToken: unknown) {
  if (typeof rawToken !== "string" || !rawToken.trim()) return null;
  return rawToken.trim();
}

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: normalizeOrigin(process.env.CLIENT_ORIGIN),
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next: (err?: Error) => void) => {
    const token =
      resolveToken(socket.handshake.auth?.token) ??
      resolveToken(socket.handshake.query?.token);

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
        sub?: string;
      };
      if (!payload.sub) {
        return next(new Error("Unauthorized"));
      }

      const user = await User.findById(payload.sub).select("_id role");
      if (!user) {
        return next(new Error("Unauthorized"));
      }

      socket.data.userId = String(user._id);
      socket.join(`user:${user._id}`);
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    socket.on("disconnect", () => {
      // No-op; socket rooms clean up automatically.
    });
  });

  return io;
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
