import type { LogEntry, CreateLogInput } from "@/features/logs/types";

export interface LogRepository {
  create(input: CreateLogInput): Promise<LogEntry>;
  listByOrganization(
    organizationId: string,
    limit?: number
  ): Promise<LogEntry[]>;
  listByActor(actorId: string, limit?: number): Promise<LogEntry[]>;
}

export class MockLogRepository implements LogRepository {
  private logs: LogEntry[] = [];

  async create(input: CreateLogInput): Promise<LogEntry> {
    const log: LogEntry = {
      id: `log_${Date.now()}`,
      organization_id: input.organizationId ?? null,
      actor_id: input.actorId ?? null,
      action: input.action,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      metadata: input.metadata ?? {},
      ip_address: null,
      created_at: new Date().toISOString()
    };
    this.logs.push(log);
    return log;
  }

  async listByOrganization(
    organizationId: string,
    limit = 50
  ): Promise<LogEntry[]> {
    return this.logs
      .filter((l) => l.organization_id === organizationId)
      .slice(0, limit);
  }

  async listByActor(actorId: string, limit = 50): Promise<LogEntry[]> {
    return this.logs.filter((l) => l.actor_id === actorId).slice(0, limit);
  }
}
