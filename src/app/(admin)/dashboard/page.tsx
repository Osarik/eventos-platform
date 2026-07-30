import { BarChart3, CalendarDays, CreditCard, Ticket } from "lucide-react";

import { StatCard } from "@/features/dashboard/components/stat-card";
import { EventsTable } from "@/features/events/components/events-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";

export const metadata = {
  title: "Dashboard"
};

export default async function DashboardPage() {
  const eventRepo = new EventMockRepository();
  const stats = await eventRepo.getStats();
  const events = await eventRepo.getWithStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
        <p className="mt-2 text-muted-foreground">
          Vista general de ventas, eventos y operacion.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ingresos"
          value={formatCurrency(stats.total_revenue)}
          helper="Calculado con datos mock"
          icon={CreditCard}
        />
        <StatCard
          title="Tickets vendidos"
          value={String(stats.tickets_sold)}
          helper="Entradas emitidas"
          icon={Ticket}
        />
        <StatCard
          title="Eventos activos"
          value={String(stats.active_events)}
          helper="Disponibles para compra"
          icon={CalendarDays}
        />
        <StatCard
          title="Conversion"
          value={`${stats.tickets_sold > 0 ? Math.round((stats.tickets_used / stats.tickets_sold) * 100) : 0}%`}
          helper="Preparado para analytics"
          icon={BarChart3}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Eventos recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsTable initialEvents={events} />
        </CardContent>
      </Card>
    </div>
  );
}
