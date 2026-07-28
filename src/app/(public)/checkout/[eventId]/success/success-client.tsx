"use client";

import { CheckCircle2, Ticket } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketMockRepository } from "@/features/tickets/services/ticket-mock-repository";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";

type GeneratedTicket = {
  code: string;
  secureToken: string;
  attendeeName: string;
  attendeeEmail: string;
};

const ticketRepo = new TicketMockRepository();
const eventRepo = new EventMockRepository();

type Props = {
  eventId: string;
  eventTitle: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
  total: string;
};

export function SuccessPageClient({
  eventId,
  eventTitle,
  buyerName,
  buyerEmail,
  quantity,
  total
}: Props) {
  const [tickets, setTickets] = useState<GeneratedTicket[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    async function generate() {
      const event = await eventRepo.getById(eventId);
      if (!event) return;

      const generated: GeneratedTicket[] = [];
      for (let i = 0; i < quantity; i++) {
        const ticket = await ticketRepo.create({
          evento_id: eventId,
          code: ticketRepo.generateCode(event.slug),
          secure_token: ticketRepo.generateSecureToken(),
          attendee_name: buyerName,
          attendee_email: buyerEmail
        });
        generated.push({
          code: ticket.code,
          secureToken: ticket.secure_token,
          attendeeName: ticket.attendee_name,
          attendeeEmail: ticket.attendee_email
        });
      }
      setTickets(generated);
      setIsGenerating(false);
    }
    generate();
  }, [eventId, buyerName, buyerEmail, quantity]);

  if (isGenerating) {
    return (
      <main className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">
            Generando tus entradas...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-14">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">
          Compra exitosa
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Tus entradas para <strong>{eventTitle}</strong> estan listas.
        </p>
        <p className="text-sm text-muted-foreground">
          Comprador: {buyerName} &middot; {buyerEmail} &middot; Total: $
          {parseInt(total).toLocaleString("es-CO")}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
        {tickets.map((ticket, idx) => (
          <Card key={ticket.code}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Entrada #{idx + 1}</CardTitle>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {ticket.code}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-lg bg-white p-3">
                  <QRCode value={ticket.secureToken} size={140} />
                </div>
              </div>
              <div className="text-center text-sm">
                <p className="font-medium">{ticket.attendeeName}</p>
                <p className="text-muted-foreground">{ticket.attendeeEmail}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {eventTitle}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-md space-y-3 text-center">
        <p className="text-xs text-muted-foreground">
          Token unico por entrada. Presenta este QR en la entrada del evento
          para ser validado.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/eventos">Ver mas eventos</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
