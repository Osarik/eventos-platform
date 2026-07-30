import type { Metadata } from "next";
import { Ticket } from "lucide-react";

import { createSupabaseServerPageClient } from "@/services/supabase/server";
import { TicketMockRepository } from "@/features/tickets/services/ticket-mock-repository";
import { TicketCard } from "@/features/tickets/components/ticket-card";

export const metadata: Metadata = {
  title: "Mis Entradas"
};

export default async function MisEntradasPage() {
  const supabase = await createSupabaseServerPageClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const ticketRepo = new TicketMockRepository();
  const tickets = await ticketRepo.listByAttendeeEmail(email);

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Ticket className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold">No tienes entradas</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Cuando compres entradas a un evento, apareceran aqui con su codigo QR
          para ingresar.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Mis Entradas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {tickets.length} entrada{tickets.length !== 1 ? "s" : ""} comprada
          {tickets.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </section>
  );
}
