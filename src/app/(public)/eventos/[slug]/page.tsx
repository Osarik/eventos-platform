import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { getEventBySlug } from "@/services/events/event-service";

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <main>
      <section className="border-b">
        <div className="container grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <Badge
              variant={event.status === "active" ? "success" : "secondary"}
            >
              {event.status}
            </Badge>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                {event.title}
              </h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                {event.description}
              </p>
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {formatDate(event.startsAt)}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.address}, {event.city}
              </p>
              <p className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                {formatCurrency(event.price)}
              </p>
            </div>
            <Button asChild size="lg">
              <Link href={`/checkout/${event.id}`}>Comprar entrada</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="container grid gap-6 py-12 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Descripcion</CardTitle>
          </CardHeader>
          <CardContent className="leading-7 text-muted-foreground">
            {event.description} El modulo queda listo para extender agenda,
            artistas, beneficios, politicas de reembolso y condiciones del
            organizador.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted text-center text-sm text-muted-foreground">
              Mapa preparado para Google Maps o Mapbox.
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
