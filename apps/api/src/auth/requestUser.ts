import type { Request } from "express";

export const demoUserId = "00000000-0000-0000-0000-000000000001";

export const resolveRequestUserId = (req: Request): string => {
  const headerValue = req.header("x-user-id")?.trim();
  if (headerValue) {
    return headerValue;
  }

  return process.env.DEMO_USER_ID?.trim() || demoUserId;
};
