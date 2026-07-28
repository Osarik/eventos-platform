import { events } from "@/services/events/mock-data";

export function listEvents() {
  return events;
}

export function listActiveEvents() {
  return events.filter((event) => event.status === "active");
}

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function getEventById(id: string) {
  return events.find((event) => event.id === id);
}

export function getEventStats() {
  const totalRevenue = events.reduce(
    (sum, event) => sum + event.price * event.sold,
    0
  );
  const ticketsSold = events.reduce((sum, event) => sum + event.sold, 0);
  const activeEvents = events.filter((event) => event.status === "active");

  return {
    totalRevenue,
    ticketsSold,
    activeEvents: activeEvents.length,
    conversionRate: 68
  };
}
