import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[Error]", err);

  if (res.headersSent) return;

  const status =
    typeof err === "object" && err !== null && "status" in err
      ? (err as { status: number }).status
      : 500;
  const message =
    typeof err === "object" && err !== null && "message" in err
      ? (err as { message: string }).message
      : "Internal server error.";

  res.status(status).json({ message });
}
