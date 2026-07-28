import { tickets } from "@/services/events/mock-data";

export function listTickets() {
  return tickets;
}

export function findTicketByCode(code: string) {
  return tickets.find((ticket) => ticket.code === code);
}
