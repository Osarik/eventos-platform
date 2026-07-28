import { notFound } from "next/navigation";
import { CreditCard } from "lucide-react";

import { CheckoutForm } from "@/features/payments/components/checkout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";

export default async function CheckoutPage({
  params
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const eventRepo = new EventMockRepository();
  const event = await eventRepo.getById(eventId);

  if (!event) {
    notFound();
  }

  return (
    <main className="container grid gap-8 py-14 lg:grid-cols-[1fr_0.8fr]">
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <CreditCard className="h-4 w-4" />
          Pago seguro
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">
          Completa tus datos
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Recibiras tus entradas con codigo QR en el correo despues del pago.
        </p>
        <Card className="mt-8">
          <CardContent className="pt-6">
            <CheckoutForm eventId={eventId} unitPrice={event.price_cop} />
          </CardContent>
        </Card>
      </section>
      <aside>
        <Card>
          <CardHeader>
            <CardTitle>Resumen de compra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="font-semibold">{event.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(event.starts_at)}
              </p>
              <p className="text-sm text-muted-foreground">
                {event.venue}, {event.city}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3 text-sm">
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Pago con ePayco</p>
                <p className="text-xs text-muted-foreground">
                  Tarjetas, PSE, Nequi, Daviplata, Efecty
                </p>
              </div>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="text-muted-foreground">Precio por entrada</span>
              <span className="font-semibold">
                {formatCurrency(event.price_cop)}
              </span>
            </div>
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
