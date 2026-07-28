import QRCode from "react-qr-code";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { TicketWithDetails } from "@/features/tickets/types";

export function TicketsTable({ tickets }: { tickets: TicketWithDetails[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>QR</TableHead>
          <TableHead>Codigo</TableHead>
          <TableHead>Asistente</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-white p-2">
                <QRCode value={ticket.secure_token} size={40} />
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs">{ticket.code}</TableCell>
            <TableCell>
              <div className="font-medium">{ticket.attendee_name}</div>
              <div className="text-sm text-muted-foreground">
                {ticket.attendee_email}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  ticket.status === "valid"
                    ? "success"
                    : ticket.status === "used"
                      ? "secondary"
                      : "destructive"
                }
              >
                {ticket.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
