import crypto from "crypto";
import type { Ticket, TicketWithDetails } from "@/features/tickets/types";
import type {
  CreateTicketInput,
  ValidateTicketResult
} from "@/features/tickets/types";
import type { TicketRepository } from "./ticket-repository";

const mockTickets: Ticket[] = [
  {
    id: "tic_001",
    compra_id: null,
    evento_id: "evt_001",
    purchase_id: null,
    code: "TKT-NEON-8F4K2A",
    secure_token:
      "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    token_salt: "salt001",
    attendee_name: "Laura Gomez",
    attendee_email: "laura@example.com",
    status: "valid",
    checked_in_at: null,
    created_at: "2026-07-21T14:18:00-05:00"
  },
  {
    id: "tic_002",
    compra_id: null,
    evento_id: "evt_001",
    purchase_id: null,
    code: "TKT-NEON-3D9P1Q",
    secure_token:
      "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1",
    token_salt: "salt002",
    attendee_name: "Carlos Rios",
    attendee_email: "carlos@example.com",
    status: "used",
    checked_in_at: "2026-09-12T22:08:00-05:00",
    created_at: "2026-07-21T14:18:00-05:00"
  },
  {
    id: "tic_003",
    compra_id: null,
    evento_id: "evt_002",
    purchase_id: null,
    code: "TKT-SUMMIT-2L8M7B",
    secure_token:
      "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    token_salt: "salt003",
    attendee_name: "Andres Mora",
    attendee_email: "andres@example.com",
    status: "valid",
    checked_in_at: null,
    created_at: "2026-07-22T09:41:00-05:00"
  }
];

export class TicketMockRepository implements TicketRepository {
  async list(): Promise<Ticket[]> {
    return [...mockTickets];
  }

  async listByEvent(eventId: string): Promise<Ticket[]> {
    return mockTickets.filter((t) => t.evento_id === eventId);
  }

  async getById(id: string): Promise<Ticket | null> {
    return mockTickets.find((t) => t.id === id) ?? null;
  }

  async getByCode(code: string): Promise<Ticket | null> {
    return mockTickets.find((t) => t.code === code) ?? null;
  }

  async getBySecureToken(token: string): Promise<Ticket | null> {
    return mockTickets.find((t) => t.secure_token === token) ?? null;
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const ticket: Ticket = {
      id: `tic_${Date.now()}`,
      compra_id: input.compra_id ?? null,
      evento_id: input.evento_id,
      purchase_id: input.purchase_id ?? null,
      code: input.code,
      secure_token: input.secure_token,
      token_salt: crypto.randomBytes(16).toString("hex"),
      attendee_name: input.attendee_name,
      attendee_email: input.attendee_email,
      status: "valid",
      checked_in_at: null,
      created_at: new Date().toISOString()
    };
    mockTickets.push(ticket);
    return ticket;
  }

  async markAsUsed(id: string): Promise<Ticket> {
    const idx = mockTickets.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Ticket not found");
    mockTickets[idx].status = "used";
    mockTickets[idx].checked_in_at = new Date().toISOString();
    return mockTickets[idx];
  }

  async cancel(id: string): Promise<Ticket> {
    const idx = mockTickets.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Ticket not found");
    mockTickets[idx].status = "cancelled";
    return mockTickets[idx];
  }

  async validateByToken(token: string): Promise<ValidateTicketResult> {
    const ticket = mockTickets.find((t) => t.secure_token === token);
    if (!ticket) {
      return { valid: false, status: "valid", message: "Ticket no encontrado" };
    }
    if (ticket.status === "used") {
      return {
        valid: false,
        status: "used",
        ticket: { ...ticket },
        message: "Este ticket ya fue utilizado"
      };
    }
    if (ticket.status === "cancelled") {
      return {
        valid: false,
        status: "cancelled",
        ticket: { ...ticket },
        message: "Este ticket ha sido cancelado"
      };
    }
    return {
      valid: true,
      status: "valid",
      ticket: { ...ticket },
      message: "Entrada válida"
    };
  }

  generateCode(eventSlug: string): string {
    const prefix = eventSlug.slice(0, 4).toUpperCase();
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `TKT-${prefix}-${random}`;
  }

  generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async listWithDetails(): Promise<TicketWithDetails[]> {
    return mockTickets.map((t) => this._enrich(t));
  }

  async listByAttendeeEmail(email: string): Promise<TicketWithDetails[]> {
    return mockTickets
      .filter((t) => t.attendee_email === email)
      .map((t) => this._enrich(t));
  }

  private _enrich(t: Ticket): TicketWithDetails {
    const eventLabel =
      t.evento_id === "evt_001"
        ? {
            title: "Neon Sessions Medellin",
            slug: "neon-sessions-medellin",
            date: "2026-09-12T21:00:00-05:00",
            city: "Medellin",
            venue: "Warehouse 33",
            category: "musica" as const
          }
        : t.evento_id === "evt_002"
          ? {
              title: "Summit Creadores Bogota",
              slug: "summit-creadores-bogota",
              date: "2026-10-04T09:00:00-05:00",
              city: "Bogota",
              venue: "Agora Bogota",
              category: "conferencia" as const
            }
          : {
              title: "Evento",
              slug: "evento",
              date: new Date().toISOString(),
              city: "Ciudad",
              venue: "Lugar",
              category: null
            };

    const purchaseLabel =
      t.compra_id === "comp_001"
        ? { status: "paid" as const, quantity: 2 }
        : t.compra_id === "comp_002"
          ? { status: "paid" as const, quantity: 1 }
          : { status: "pending" as const, quantity: 1 };

    return {
      ...t,
      event_title: eventLabel.title,
      event_slug: eventLabel.slug,
      event_date: eventLabel.date,
      event_city: eventLabel.city,
      event_venue: eventLabel.venue,
      event_category: eventLabel.category,
      purchase_status: purchaseLabel.status,
      purchase_quantity: purchaseLabel.quantity,
      buyer_name: t.attendee_name,
      buyer_email: t.attendee_email
    };
  }
}
