"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MockValidationService } from "@/features/scanner/services/validation-service";

const validationService = new MockValidationService();

export function QrScanner() {
  const scannerId = useId().replace(/:/g, "");
  const [token, setToken] = useState("");
  const [result, setResult] = useState<{
    valid: boolean;
    status: string;
    message: string;
    ticket?: {
      attendeeName?: string;
      attendeeEmail?: string;
      eventTitle?: string;
      checkedInAt?: string | null;
    };
  } | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      scannerId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        setToken(decodedText);
        validationService.validateByToken(decodedText).then(setResult);
      },
      () => undefined
    );

    return () => {
      scanner.clear().catch(() => undefined);
    };
  }, [scannerId]);

  async function handleManualValidate() {
    if (!token) return;
    const res = await validationService.validateByToken(token);
    setResult(res);
  }

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
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualValidate()}
              placeholder="Pegar token manualmente"
              className="pl-9"
            />
          </div>
          {!token && (
            <p className="text-sm text-muted-foreground">
              Escanea un QR o pega un token para validar la entrada.
            </p>
          )}
          {result?.valid && (
            <div className="rounded-lg border border-accent/40 bg-accent/10 p-4">
              <CheckCircle2 className="mb-3 h-6 w-6 text-accent" />
              <h3 className="font-semibold">Entrada valida</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.ticket?.attendeeName} · {result.ticket?.attendeeEmail}
              </p>
              <p className="text-xs text-muted-foreground">
                {result.ticket?.eventTitle}
              </p>
              <Badge className="mt-3" variant="success">
                Permitir ingreso
              </Badge>
            </div>
          )}
          {result && !result.valid && result.status === "used" && (
            <div className="rounded-lg border p-4">
              <XCircle className="mb-3 h-6 w-6 text-muted-foreground" />
              <h3 className="font-semibold">Entrada usada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Esta entrada ya fue validada anteriormente.
              </p>
              {result.ticket?.checkedInAt && (
                <p className="text-xs text-muted-foreground">
                  Ingreso: {result.ticket.checkedInAt}
                </p>
              )}
            </div>
          )}
          {result && !result.valid && result.status === "invalid" && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
              <XCircle className="mb-3 h-6 w-6 text-destructive" />
              <h3 className="font-semibold">Entrada invalida</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No encontramos este token en la base de datos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
