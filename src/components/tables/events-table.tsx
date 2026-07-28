import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Event } from "@/types/database";

export function EventsTable({ events }: { events: Event[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Evento</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Ventas</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-muted-foreground">
                {event.venue}, {event.city}
              </div>
            </TableCell>
            <TableCell>{formatDate(event.startsAt)}</TableCell>
            <TableCell>
              {event.sold}/{event.capacity} · {formatCurrency(event.price)}
            </TableCell>
            <TableCell>
              <Badge
                variant={event.status === "active" ? "success" : "secondary"}
              >
                {event.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button size="icon" variant="ghost" aria-label="Acciones">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
