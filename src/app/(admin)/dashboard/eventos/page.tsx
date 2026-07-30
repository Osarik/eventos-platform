import { EventForm } from "@/features/events/components/event-form";
import { EventsTable } from "@/features/events/components/events-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";

export const metadata = {
  title: "Eventos Admin"
};

export default async function AdminEventsPage() {
  const eventRepo = new EventMockRepository();
  const events = await eventRepo.getWithStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Eventos</h2>
        <p className="mt-2 text-muted-foreground">
          Administra los eventos de La Jugada Bar
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Crear evento</CardTitle>
          <p className="text-sm text-muted-foreground">
            Los datos se guardan en memoria durante esta sesion.
          </p>
        </CardHeader>
        <CardContent>
          <EventForm onSuccess={() => {}} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsTable initialEvents={events} />
        </CardContent>
      </Card>
    </div>
  );
}
