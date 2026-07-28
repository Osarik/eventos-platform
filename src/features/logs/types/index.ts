import type { Log } from "@/types/database";

export type LogEntry = Log;

export type CreateLogInput = {
  organizationId?: string;
  actorId?: string;
  action: Log["action"];
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
};
