import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { purchases } from "@/services/events/mock-data";

export const metadata = {
  title: "Ventas"
};

export default function SalesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Ventas</h2>
        <p className="mt-2 text-muted-foreground">
          Compras preparadas para conciliacion con Wompi.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Compras recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comprador</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>
                    <div className="font-medium">{purchase.buyerName}</div>
                    <div className="text-sm text-muted-foreground">
                      {purchase.buyerEmail}
                    </div>
                  </TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell>{formatCurrency(purchase.amount)}</TableCell>
                  <TableCell>{formatDate(purchase.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        purchase.status === "paid" ? "success" : "secondary"
                      }
                    >
                      {purchase.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
