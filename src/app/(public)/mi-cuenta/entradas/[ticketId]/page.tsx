import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  MapPin,
  Ticket
} from "lucide-react";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { createSupabaseServerPageClient } from "@/services/supabase/server";
import { TicketMockRepository } from "@/features/tickets/services/ticket-mock-repository";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Detalle de Entrada"
};

export default async function TicketDetailPage({
  params
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  const supabase = await createSupabaseServerPageClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const userEmail = user?.email ?? "";

  const ticketRepo = new TicketMockRepository();
  const ticket = await ticketRepo.getById(ticketId);

  if (!ticket || ticket.attendee_email !== userEmail) {
    notFound();
  }

  const enriched = (await ticketRepo.listByAttendeeEmail(userEmail)).find(
    (t) => t.id === ticketId
  );

  if (!enriched) {
    notFound();
  }

  const statusLabel =
    enriched.status === "valid"
      ? "Activa"
      : enriched.status === "used"
        ? "Usada"
        : "Cancelada";

  const statusColor =
    enriched.status === "valid"
      ? "text-accent"
      : enriched.status === "used"
        ? "text-muted-foreground"
        : "text-destructive";

  return (
    <div className="mx-auto max-w-lg">
      <Link
        href="/mi-cuenta"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis entradas
      </Link>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="text-center">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
              <Ticket className="h-3.5 w-3.5" />
              {enriched.code}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <QRCode value={enriched.secure_token} size={200} />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold">{enriched.event_title}</h2>
            <div className="mt-3 flex items-center justify-center gap-1 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>
                {enriched.event_date ? formatDate(enriched.event_date) : ""}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {enriched.event_venue}, {enriched.event_city}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Estado</p>
              <p className={`mt-0.5 font-medium ${statusColor}`}>
                {statusLabel}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pago</p>
              <p className="mt-0.5 font-medium">
                {enriched.purchase_status === "paid" ? "Pagado" : "Pendiente"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Asistente</p>
              <p className="mt-0.5 font-medium">{enriched.attendee_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cantidad</p>
              <p className="mt-0.5 font-medium">
                {enriched.purchase_quantity ?? 1} entrada
                {(enriched.purchase_quantity ?? 1) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" className="flex-1" disabled>
          <Download className="mr-2 h-4 w-4" />
          Descargar PDF
        </Button>
        <Button variant="outline" className="flex-1" disabled>
          Agregar al calendario
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        La descarga PDF y el calendario estaran disponibles proximamente.
      </p>
    </div>
  );
}
