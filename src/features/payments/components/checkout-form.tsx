"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkoutFormSchema,
  type CheckoutFormValues
} from "@/features/payments/validators";

export function CheckoutForm({
  eventId,
  unitPrice
}: {
  eventId: string;
  unitPrice: number;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { quantity: 1 }
  });

  const quantity = watch("quantity");

  function onSubmit(values: CheckoutFormValues) {
    const params = new URLSearchParams({
      buyerName: values.buyerName,
      buyerEmail: values.buyerEmail,
      buyerPhone: values.buyerPhone,
      quantity: String(values.quantity)
    });
    router.push(`/checkout/${eventId}/payment?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="buyerName">Nombre completo</Label>
        <Input
          id="buyerName"
          placeholder="Tu nombre"
          {...register("buyerName")}
        />
        {errors.buyerName && (
          <p className="text-sm text-destructive">{errors.buyerName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="buyerEmail">Correo electronico</Label>
        <Input
          id="buyerEmail"
          type="email"
          placeholder="correo@ejemplo.com"
          {...register("buyerEmail")}
        />
        {errors.buyerEmail && (
          <p className="text-sm text-destructive">
            {errors.buyerEmail.message}
          </p>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="buyerPhone">Telefono</Label>
          <Input
            id="buyerPhone"
            placeholder="3001234567"
            {...register("buyerPhone")}
          />
          {errors.buyerPhone && (
            <p className="text-sm text-destructive">
              {errors.buyerPhone.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad de entradas</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={10}
            {...register("quantity")}
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">
              {errors.quantity.message}
            </p>
          )}
        </div>
      </div>
      <div className="rounded-lg border bg-muted/50 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {quantity} entrada{quantity !== 1 ? "s" : ""} x $
            {unitPrice.toLocaleString("es-CO")}
          </span>
          <span className="font-semibold">
            ${(unitPrice * quantity).toLocaleString("es-CO")}
          </span>
        </div>
        <div className="mt-2 flex justify-between border-t pt-2">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold">
            ${(unitPrice * quantity).toLocaleString("es-CO")}
          </span>
        </div>
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        <CreditCard className="h-4 w-4" />
        Pagar con ePayco
        <ArrowRight className="h-4 w-4" />
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Pago procesado por ePayco &mdash; Davivienda. Tus datos estan seguros.
      </p>
    </form>
  );
}
