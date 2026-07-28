import { TicketMockRepository } from "@/features/tickets/services/ticket-mock-repository";

const repo = new TicketMockRepository();

export const listTickets = () => repo.list();
export const findTicketByCode = (code: string) => repo.getByCode(code);
export const listTicketsWithDetails = () => repo.listWithDetails();
