import { notFound } from "next/navigation";

import { CheckoutForm } from "@/components/forms/checkout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { getEventById } from "@/services/events/event-service";

export default async function CheckoutPage({
  params
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = getEventById(eventId);

  if (!event) {
    notFound();
  }

  return (
    <main className="container grid gap-8 py-14 lg:grid-cols-[1fr_0.8fr]">
      <section>
        <p className="text-sm font-medium text-primary">Checkout</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Completa tus datos
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          El pago se conectara con Wompi en el siguiente sprint. Este flujo ya
          valida datos y separa la logica del componente visual.
        </p>
        <Card className="mt-8">
          <CardContent className="pt-6">
            <CheckoutForm />
          </CardContent>
        </Card>
      </section>
      <aside>
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="font-semibold">{event.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(event.startsAt)}
              </p>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="text-muted-foreground">Precio base</span>
              <span className="font-semibold">
                {formatCurrency(event.price)}
              </span>
            </div>
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
