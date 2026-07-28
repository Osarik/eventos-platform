import type { Event, EventWithStats } from "@/features/events/types";
import type {
  CreateEventInput,
  UpdateEventInput,
  EventStats
} from "@/features/events/types";
import type { EventRepository } from "./event-repository";

const mockEvents: Event[] = [
  {
    id: "evt_001",
    owner_id: "user_demo",
    organization_id: "org_001",
    slug: "neon-sessions-medellin",
    title: "Neon Sessions Medellin",
    description:
      "Una noche curada para musica electronica, visuales inmersivos y experiencias premium.",
    category: "musica",
    venue: "Warehouse 33",
    city: "Medellin",
    address: "Carrera 43A #10-12",
    starts_at: "2026-09-12T21:00:00-05:00",
    ends_at: null,
    image_path: null,
    cover_image_path: null,
    gallery: [],
    price_cop: 89000,
    capacity: 1200,
    status: "active",
    created_at: "2026-06-01T10:00:00-05:00",
    updated_at: "2026-06-01T10:00:00-05:00"
  },
  {
    id: "evt_002",
    owner_id: "user_demo",
    organization_id: "org_001",
    slug: "summit-creadores-bogota",
    title: "Summit Creadores Bogota",
    description:
      "Conferencias, networking y workshops para creadores digitales y marcas emergentes.",
    category: "conferencia",
    venue: "Agora Bogota",
    city: "Bogota",
    address: "Avenida Calle 24 #38-47",
    starts_at: "2026-10-04T09:00:00-05:00",
    ends_at: null,
    image_path: null,
    cover_image_path: null,
    gallery: [],
    price_cop: 149000,
    capacity: 900,
    status: "active",
    created_at: "2026-06-15T10:00:00-05:00",
    updated_at: "2026-06-15T10:00:00-05:00"
  },
  {
    id: "evt_003",
    owner_id: "user_demo",
    organization_id: "org_001",
    slug: "rooftop-food-market",
    title: "Rooftop Food Market",
    description:
      "Gastronomia local, cocteles de autor y musica en vivo en formato boutique.",
    category: "gastronomia",
    venue: "Terraza Norte",
    city: "Cali",
    address: "Avenida 6N #28N-45",
    starts_at: "2026-11-21T17:00:00-05:00",
    ends_at: null,
    image_path: null,
    cover_image_path: null,
    gallery: [],
    price_cop: 45000,
    capacity: 500,
    status: "draft",
    created_at: "2026-07-01T10:00:00-05:00",
    updated_at: "2026-07-01T10:00:00-05:00"
  }
];

const mockSoldMap: Record<string, number> = {
  evt_001: 742,
  evt_002: 318,
  evt_003: 0
};

export class EventMockRepository implements EventRepository {
  async list(): Promise<Event[]> {
    return [...mockEvents];
  }

  async listByOrganization(organizationId: string): Promise<Event[]> {
    return mockEvents.filter((e) => e.organization_id === organizationId);
  }

  async listActive(): Promise<Event[]> {
    return mockEvents.filter((e) => e.status === "active");
  }

  async listUpcoming(): Promise<Event[]> {
    return mockEvents
      .filter((e) => new Date(e.starts_at) > new Date())
      .sort(
        (a, b) =>
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      );
  }

  async getById(id: string): Promise<Event | null> {
    return mockEvents.find((e) => e.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Event | null> {
    return mockEvents.find((e) => e.slug === slug) ?? null;
  }

  async create(input: CreateEventInput): Promise<Event> {
    const event: Event = {
      id: `evt_${Date.now()}`,
      owner_id: input.owner_id,
      organization_id: input.organization_id ?? null,
      slug: input.slug,
      title: input.title,
      description: input.description,
      category: input.category ?? null,
      venue: input.venue,
      city: input.city,
      address: input.address,
      starts_at: input.starts_at,
      ends_at: input.ends_at ?? null,
      image_path: input.image_path ?? null,
      cover_image_path: null,
      gallery: input.gallery ?? [],
      price_cop: input.price_cop,
      capacity: input.capacity,
      status: input.status ?? "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockEvents.push(event);
    mockSoldMap[event.id] = 0;
    return event;
  }

  async update(id: string, input: UpdateEventInput): Promise<Event> {
    const idx = mockEvents.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Event not found");
    const updated = {
      ...mockEvents[idx],
      ...input,
      updated_at: new Date().toISOString()
    };
    mockEvents[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const idx = mockEvents.findIndex((e) => e.id === id);
    if (idx !== -1) mockEvents.splice(idx, 1);
  }

  async getStats(): Promise<EventStats> {
    const active = mockEvents.filter((e) => e.status === "active");
    const totalRevenue = active.reduce(
      (sum, e) => sum + e.price_cop * (mockSoldMap[e.id] ?? 0),
      0
    );
    const ticketsSold = active.reduce(
      (sum, e) => sum + (mockSoldMap[e.id] ?? 0),
      0
    );
    const totalCapacity = mockEvents.reduce((sum, e) => sum + e.capacity, 0);

    return {
      total_revenue: totalRevenue,
      tickets_sold: ticketsSold,
      tickets_used: Math.floor(ticketsSold * 0.4),
      active_events: active.length,
      total_capacity: totalCapacity
    };
  }

  async getStatsByOrganization(organizationId: string): Promise<EventStats> {
    const orgEvents = mockEvents.filter(
      (e) => e.organization_id === organizationId
    );
    const active = orgEvents.filter((e) => e.status === "active");
    const totalRevenue = active.reduce(
      (sum, e) => sum + e.price_cop * (mockSoldMap[e.id] ?? 0),
      0
    );
    const ticketsSold = active.reduce(
      (sum, e) => sum + (mockSoldMap[e.id] ?? 0),
      0
    );

    return {
      total_revenue: totalRevenue,
      tickets_sold: ticketsSold,
      tickets_used: Math.floor(ticketsSold * 0.4),
      active_events: active.length,
      total_capacity: orgEvents.reduce((sum, e) => sum + e.capacity, 0)
    };
  }

  async getWithStats(): Promise<EventWithStats[]> {
    return mockEvents.map((e) => ({
      ...e,
      sold: mockSoldMap[e.id] ?? 0,
      revenue: (mockSoldMap[e.id] ?? 0) * e.price_cop
    }));
  }
}
