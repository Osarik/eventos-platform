import type { EventStats } from "@/features/events/types";
import type { Event } from "@/features/events/types";
import type { Ticket } from "@/features/tickets/types";

export type DashboardStats = EventStats & {
  tickets_used: number;
  upcoming_events: number;
  recent_purchases_count: number;
};

export type DashboardData = {
  stats: DashboardStats;
  recentEvents: Event[];
  recentTickets: Ticket[];
};
