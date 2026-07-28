"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkoutSchema, type CheckoutFormValues } from "@/validators/checkout";

export function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      quantity: 1
    }
  });

  function onSubmit(values: CheckoutFormValues) {
    void values;
    alert(
      "Checkout preparado. La integracion con Wompi va en el siguiente sprint."
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="buyerName">Nombre</Label>
        <Input id="buyerName" {...register("buyerName")} />
        {errors.buyerName && (
          <p className="text-sm text-destructive">{errors.buyerName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="buyerEmail">Correo</Label>
        <Input id="buyerEmail" type="email" {...register("buyerEmail")} />
        {errors.buyerEmail && (
          <p className="text-sm text-destructive">
            {errors.buyerEmail.message}
          </p>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="buyerPhone">Telefono</Label>
          <Input id="buyerPhone" {...register("buyerPhone")} />
          {errors.buyerPhone && (
            <p className="text-sm text-destructive">
              {errors.buyerPhone.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad</Label>
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
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        Continuar a pago
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
