import type { Ticket as DBTicket, TicketStatus } from "@/types/database";

export type Ticket = DBTicket;
export type TicketStatusType = TicketStatus;

export type TicketWithDetails = Ticket & {
  event_title?: string;
  event_slug?: string;
  event_date?: string;
  event_city?: string;
  event_venue?: string;
  event_category?: string | null;
  purchase_status?: string;
  purchase_quantity?: number;
  buyer_name?: string;
  buyer_email?: string;
};

export type CreateTicketInput = {
  compra_id?: string;
  evento_id: string;
  purchase_id?: string;
  code: string;
  secure_token: string;
  attendee_name: string;
  attendee_email: string;
};

export type ValidateTicketResult = {
  valid: boolean;
  status: TicketStatus;
  ticket?: TicketWithDetails;
  message: string;
};
