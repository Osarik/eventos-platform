import type { Event as DBEvent, EventStatus } from "@/types/database";

export type Event = DBEvent;
export type EventStatusType = EventStatus;

export type CreateEventInput = {
  owner_id: string;
  organization_id?: string;
  slug: string;
  title: string;
  description: string;
  category?: string;
  venue: string;
  city: string;
  address: string;
  starts_at: string;
  ends_at?: string;
  image_path?: string;
  gallery?: string[];
  price_cop: number;
  capacity: number;
  status?: EventStatus;
};

export type UpdateEventInput = Partial<CreateEventInput>;

export type EventStats = {
  total_revenue: number;
  tickets_sold: number;
  tickets_used: number;
  active_events: number;
  total_capacity: number;
};

export type EventWithStats = Event & {
  sold: number;
  revenue: number;
};
