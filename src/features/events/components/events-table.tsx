"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import type { EventWithStats } from "@/features/events/types";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";

const repo = new EventMockRepository();

export function EventsTable({
  initialEvents
}: {
  initialEvents: EventWithStats[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deletingEvent = events.find((e) => e.id === deletingId);

  async function handleDelete(id: string) {
    await repo.delete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeletingId(null);
  }

  return (
    <>
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
              <TableCell>{formatDate(event.starts_at)}</TableCell>
              <TableCell>
                {event.sold}/{event.capacity} ·{" "}
                {formatCurrency(event.price_cop)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={event.status === "active" ? "success" : "secondary"}
                >
                  {event.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" aria-label="Acciones">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeletingId(event.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar evento</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar <strong>{deletingEvent?.title}</strong>?
              Esta accion no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
