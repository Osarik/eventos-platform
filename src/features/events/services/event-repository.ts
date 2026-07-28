import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
  EventStats,
  EventWithStats
} from "@/features/events/types";

export interface EventRepository {
  list(): Promise<Event[]>;
  listByOrganization(organizationId: string): Promise<Event[]>;
  listActive(): Promise<Event[]>;
  listUpcoming(): Promise<Event[]>;
  getById(id: string): Promise<Event | null>;
  getBySlug(slug: string): Promise<Event | null>;
  create(input: CreateEventInput): Promise<Event>;
  update(id: string, input: UpdateEventInput): Promise<Event>;
  delete(id: string): Promise<void>;
  getStats(): Promise<EventStats>;
  getStatsByOrganization(organizationId: string): Promise<EventStats>;
  getWithStats(): Promise<EventWithStats[]>;
}
