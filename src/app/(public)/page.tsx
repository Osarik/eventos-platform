import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, TicketCheck } from "lucide-react";

import { EventCard } from "@/features/events/components/event-card";
import { Button } from "@/components/ui/button";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";

export default async function HomePage() {
  const eventRepo = new EventMockRepository();
  const featuredEvents = await eventRepo.listActive();

  return (
    <main>
      <section className="border-b">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm text-muted-foreground">
              <TicketCheck className="h-4 w-4 text-accent" />
              SaaS de boleteria preparado para crecer
            </div>
            <div className="space-y-5">
              <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
                Descubre y asegura tu entrada
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Los mejores eventos, conciertos y experiencias culturales.
                Compra tus entradas al instante con codigos QR seguros.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/eventos">
                  Ver eventos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              {
                icon: CalendarDays,
                title: "Eventos exclusivos",
                text: "Conciertos, conferencias, festivales y experiencias culturales seleccionadas para ti."
              },
              {
                icon: TicketCheck,
                title: "Tickets con QR",
                text: "Compra y recibe tu codigo QR unico al instante. Entrada segura sin filas."
              },
              {
                icon: MapPin,
                title: "Cobertura nacional",
                text: "Eventos en las principales ciudades de Colombia. Siempre hay algo cerca de ti."
              }
            ].map((item) => (
              <div key={item.title} className="rounded-lg border bg-card p-5">
                <item.icon className="mb-4 h-5 w-5 text-primary" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Eventos activos</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Experiencias listas para vivir
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/eventos">Ver todos</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
