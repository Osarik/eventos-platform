export type UserRole = "admin" | "staff" | "customer";

export type EventStatus = "draft" | "active" | "paused" | "finished";

export type TicketStatus = "valid" | "used" | "cancelled";

export type PurchaseStatus = "pending" | "paid" | "failed" | "refunded";

export type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  address: string;
  startsAt: string;
  imageUrl: string;
  price: number;
  capacity: number;
  sold: number;
  status: EventStatus;
};

export type Ticket = {
  id: string;
  code: string;
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  status: TicketStatus;
  checkedInAt?: string;
};

export type Purchase = {
  id: string;
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
  amount: number;
  status: PurchaseStatus;
  createdAt: string;
};

export type Validation = {
  id: string;
  ticketId: string;
  validatedBy: string;
  result: "accepted" | "rejected";
  reason?: string;
  createdAt: string;
};
