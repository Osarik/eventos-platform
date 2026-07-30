import { CalendarDays, Eye, MapPin } from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { TicketWithDetails } from "@/features/tickets/types";

type Props = {
  ticket: TicketWithDetails;
};

export function TicketCard({ ticket }: Props) {
  const statusLabel =
    ticket.status === "valid"
      ? "Activa"
      : ticket.status === "used"
        ? "Usada"
        : "Cancelada";

  const statusColor =
    ticket.status === "valid"
      ? "text-accent"
      : ticket.status === "used"
        ? "text-muted-foreground"
        : "text-destructive";

  const paymentLabel =
    ticket.purchase_status === "paid" ? "Pagado" : "Pendiente";

  const paymentColor =
    ticket.purchase_status === "paid" ? "text-accent" : "text-amber-500";

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between bg-muted/40 px-6 py-3">
        <span className="text-xs font-medium text-muted-foreground">
          {ticket.code}
        </span>
        <span className={`text-xs font-medium ${statusColor}`}>
          {statusLabel}
        </span>
      </div>
      <CardContent className="flex-1 space-y-4 pt-5">
        <div className="flex justify-center">
          <div className="rounded-lg bg-white p-2">
            <QRCode value={ticket.secure_token} size={100} />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-semibold leading-tight">{ticket.event_title}</h3>
          <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {ticket.event_date ? formatDate(ticket.event_date) : ""}
          </div>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {ticket.event_city}, {ticket.event_venue}
          </div>
        </div>
        <div className="flex justify-center gap-4 text-xs">
          <span className={`font-medium ${paymentColor}`}>{paymentLabel}</span>
          <span className="text-muted-foreground">{ticket.attendee_name}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 px-6 py-3">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/mi-cuenta/entradas/${ticket.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver QR
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
