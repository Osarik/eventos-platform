import { Search } from "lucide-react";

import { TicketsTable } from "@/components/tables/tickets-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listTickets } from "@/services/tickets/ticket-service";

export const metadata = {
  title: "Tickets"
};

export default function TicketsPage() {
  const tickets = listTickets();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Tickets</h2>
        <p className="mt-2 text-muted-foreground">
          Busca, filtra y revisa codigos QR emitidos.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listado de entradas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por codigo o correo" className="pl-9" />
          </div>
          <TicketsTable tickets={tickets} />
        </CardContent>
      </Card>
    </div>
  );
}
