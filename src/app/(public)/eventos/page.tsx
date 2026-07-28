import { EventCard } from "@/components/cards/event-card";
import { listEvents } from "@/services/events/event-service";

export const metadata = {
  title: "Eventos"
};

export default function EventsPage() {
  const events = listEvents();

  return (
    <main className="container py-14">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium text-primary">Catalogo</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Eventos</h1>
        <p className="mt-4 text-muted-foreground">
          Explora eventos activos y proximos. El checkout esta preparado para
          conectar Wompi en el siguiente sprint.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}
