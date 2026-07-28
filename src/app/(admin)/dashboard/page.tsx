import { BarChart3, CalendarDays, CreditCard, Ticket } from "lucide-react";

import { StatCard } from "@/components/cards/stat-card";
import { EventsTable } from "@/components/tables/events-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { getEventStats, listEvents } from "@/services/events/event-service";

export const metadata = {
  title: "Dashboard"
};

export default function DashboardPage() {
  const stats = getEventStats();
  const events = listEvents();

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
          value={formatCurrency(stats.totalRevenue)}
          helper="Calculado con datos mock"
          icon={CreditCard}
        />
        <StatCard
          title="Tickets vendidos"
          value={String(stats.ticketsSold)}
          helper="Entradas emitidas"
          icon={Ticket}
        />
        <StatCard
          title="Eventos activos"
          value={String(stats.activeEvents)}
          helper="Disponibles para compra"
          icon={CalendarDays}
        />
        <StatCard
          title="Conversion"
          value={`${stats.conversionRate}%`}
          helper="Preparado para analytics"
          icon={BarChart3}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Eventos recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsTable events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
