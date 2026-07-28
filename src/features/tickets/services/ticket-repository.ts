import type {
  Ticket,
  TicketWithDetails,
  CreateTicketInput,
  ValidateTicketResult
} from "@/features/tickets/types";

export interface TicketRepository {
  list(): Promise<Ticket[]>;
  listByEvent(eventId: string): Promise<Ticket[]>;
  getById(id: string): Promise<Ticket | null>;
  getByCode(code: string): Promise<Ticket | null>;
  getBySecureToken(token: string): Promise<Ticket | null>;
  create(input: CreateTicketInput): Promise<Ticket>;
  markAsUsed(id: string): Promise<Ticket>;
  cancel(id: string): Promise<Ticket>;
  validateByToken(token: string): Promise<ValidateTicketResult>;
  generateCode(eventSlug: string): string;
  generateSecureToken(): string;
  listWithDetails(): Promise<TicketWithDetails[]>;
}
