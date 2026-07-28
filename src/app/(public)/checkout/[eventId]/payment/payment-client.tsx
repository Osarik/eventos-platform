"use client";

import { CreditCard, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type Props = {
  eventId: string;
  eventTitle: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export function PaymentPageClient({
  eventId,
  eventTitle,
  buyerName,
  buyerEmail,
  buyerPhone,
  quantity,
  unitPrice,
  total
}: Props) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [method, setMethod] = useState<string>("card");

  async function handlePay() {
    setIsProcessing(true);

    const params = new URLSearchParams({
      eventId,
      eventTitle,
      buyerName,
      buyerEmail,
      buyerPhone,
      quantity: String(quantity),
      unitPrice: String(unitPrice),
      total: String(total)
    });

    await new Promise((r) => setTimeout(r, 2000));

    router.push(`/checkout/${eventId}/success?${params.toString()}`);
  }

  return (
    <main className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="grid w-full max-w-3xl gap-8 lg:grid-cols-[1fr_1.2fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">{eventTitle}</p>
              <p className="text-muted-foreground">
                {quantity} entrada{quantity !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(unitPrice * quantity)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Pagar con ePayco</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Simulacion de pasarela de pago ePayco (Davivienda)
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "card", label: "Tarjeta" },
                { id: "pse", label: "PSE" },
                { id: "nequi", label: "Nequi" },
                { id: "daviplata", label: "Daviplata" }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                    method === m.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "hover:border-muted-foreground/30"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {method === "card" && (
              <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Numero de tarjeta
                  </p>
                  <p className="font-mono text-lg tracking-widest">
                    4575 6231 8229 0326
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Vence</p>
                    <p className="font-mono">12/25</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">CVC</p>
                    <p className="font-mono">123</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tarjeta de prueba — modo demostracion
                </p>
              </div>
            )}

            {method === "pse" && (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Selecciona tu banco para pagar con PSE (transferencia bancaria).
              </div>
            )}

            {method === "nequi" && (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Recibiras una notificacion en tu app Nequi para confirmar el
                pago.
              </div>
            )}

            {method === "daviplata" && (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Recibiras un codigo OTP en tu celular para confirmar el pago con
                Daviplata.
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Pago seguro cifrado SSL. No guardamos datos de tu tarjeta.
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={isProcessing}
              onClick={handlePay}
            >
              {isProcessing
                ? "Procesando pago..."
                : `Pagar ${formatCurrency(total)}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
