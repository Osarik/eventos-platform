"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { findTicketByCode } from "@/services/tickets/ticket-service";

export function QrScanner() {
  const scannerId = useId().replace(/:/g, "");
  const [code, setCode] = useState("");
  const ticket = code ? findTicketByCode(code) : undefined;

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      scannerId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => setCode(decodedText),
      () => undefined
    );

    return () => {
      scanner.clear().catch(() => undefined);
    };
  }, [scannerId]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Camara</CardTitle>
        </CardHeader>
        <CardContent>
          <div id={scannerId} className="overflow-hidden rounded-lg border" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Pegar codigo manualmente"
              className="pl-9"
            />
          </div>
          {!code && (
            <p className="text-sm text-muted-foreground">
              Escanea un QR o pega un codigo para validar la entrada.
            </p>
          )}
          {code && ticket?.status === "valid" && (
            <div className="rounded-lg border border-accent/40 bg-accent/10 p-4">
              <CheckCircle2 className="mb-3 h-6 w-6 text-accent" />
              <h3 className="font-semibold">Entrada valida</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {ticket.attendeeName} · {ticket.attendeeEmail}
              </p>
              <Badge className="mt-3" variant="success">
                Permitir ingreso
              </Badge>
            </div>
          )}
          {code && ticket?.status === "used" && (
            <div className="rounded-lg border p-4">
              <XCircle className="mb-3 h-6 w-6 text-muted-foreground" />
              <h3 className="font-semibold">Entrada usada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Esta entrada ya fue validada anteriormente.
              </p>
            </div>
          )}
          {code && !ticket && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
              <XCircle className="mb-3 h-6 w-6 text-destructive" />
              <h3 className="font-semibold">Entrada invalida</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No encontramos este codigo en la base de datos local.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
