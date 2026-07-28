import { Plus } from "lucide-react";

import { EventForm } from "@/features/events/components/event-form";
import { EventsTable } from "@/features/events/components/events-table";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Eventos</h2>
          <p className="mt-2 text-muted-foreground">
            CRUD visual preparado para conectar Supabase y Storage.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Nuevo evento
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Crear evento</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsTable events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
