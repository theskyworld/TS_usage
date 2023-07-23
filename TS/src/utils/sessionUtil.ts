import { Request } from "express";
export function getSession(req: Request) {
  return (req as any).session;
}
