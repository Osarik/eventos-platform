import type { Event, Purchase, Ticket } from "@/types/database";

export const events: Event[] = [
  {
    id: "evt_001",
    slug: "neon-sessions-medellin",
    title: "Neon Sessions Medellin",
    description:
      "Una noche curada para musica electronica, visuales inmersivos y experiencias premium.",
    venue: "Warehouse 33",
    city: "Medellin",
    address: "Carrera 43A #10-12",
    startsAt: "2026-09-12T21:00:00-05:00",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
    price: 89000,
    capacity: 1200,
    sold: 742,
    status: "active"
  },
  {
    id: "evt_002",
    slug: "summit-creadores-bogota",
    title: "Summit Creadores Bogota",
    description:
      "Conferencias, networking y workshops para creadores digitales y marcas emergentes.",
    venue: "Agora Bogota",
    city: "Bogota",
    address: "Avenida Calle 24 #38-47",
    startsAt: "2026-10-04T09:00:00-05:00",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80",
    price: 149000,
    capacity: 900,
    sold: 318,
    status: "active"
  },
  {
    id: "evt_003",
    slug: "rooftop-food-market",
    title: "Rooftop Food Market",
    description:
      "Gastronomia local, cocteles de autor y musica en vivo en formato boutique.",
    venue: "Terraza Norte",
    city: "Cali",
    address: "Avenida 6N #28N-45",
    startsAt: "2026-11-21T17:00:00-05:00",
    imageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80",
    price: 45000,
    capacity: 500,
    sold: 126,
    status: "draft"
  }
];

export const purchases: Purchase[] = [
  {
    id: "buy_001",
    eventId: "evt_001",
    buyerName: "Laura Gomez",
    buyerEmail: "laura@example.com",
    quantity: 2,
    amount: 178000,
    status: "paid",
    createdAt: "2026-07-21T14:18:00-05:00"
  },
  {
    id: "buy_002",
    eventId: "evt_002",
    buyerName: "Andres Mora",
    buyerEmail: "andres@example.com",
    quantity: 1,
    amount: 149000,
    status: "pending",
    createdAt: "2026-07-22T09:41:00-05:00"
  }
];

export const tickets: Ticket[] = [
  {
    id: "tic_001",
    code: "EVP-NEON-8F4K2A",
    eventId: "evt_001",
    attendeeName: "Laura Gomez",
    attendeeEmail: "laura@example.com",
    status: "valid"
  },
  {
    id: "tic_002",
    code: "EVP-NEON-3D9P1Q",
    eventId: "evt_001",
    attendeeName: "Carlos Rios",
    attendeeEmail: "carlos@example.com",
    status: "used",
    checkedInAt: "2026-09-12T22:08:00-05:00"
  },
  {
    id: "tic_003",
    code: "EVP-SUMMIT-2L8M7B",
    eventId: "evt_002",
    attendeeName: "Andres Mora",
    attendeeEmail: "andres@example.com",
    status: "valid"
  }
];
