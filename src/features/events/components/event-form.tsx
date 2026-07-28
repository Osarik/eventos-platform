"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  eventFormSchema,
  type EventFormValues
} from "@/features/events/validators";

export function EventForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "Nuevo evento",
      status: "draft",
      price: 0,
      capacity: 100
    }
  });

  function onSubmit(values: EventFormValues) {
    void values;
    alert(
      "Formulario visual listo. La persistencia con Supabase va en el siguiente sprint."
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-5 lg:grid-cols-2"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Nombre del evento</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="venue">Lugar</Label>
        <Input id="venue" {...register("venue")} />
        {errors.venue && (
          <p className="text-sm text-destructive">{errors.venue.message}</p>
        )}
      </div>
      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="description">Descripcion</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">Ciudad</Label>
        <Input id="city" {...register("city")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Direccion</Label>
        <Input id="address" {...register("address")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="startsAt">Fecha y hora</Label>
        <Input id="startsAt" type="datetime-local" {...register("startsAt")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Estado</Label>
        <select
          id="status"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register("status")}
        >
          <option value="draft">Borrador</option>
          <option value="active">Activo</option>
          <option value="paused">Pausado</option>
          <option value="finished">Finalizado</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Precio COP</Label>
        <Input id="price" type="number" {...register("price")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="capacity">Capacidad</Label>
        <Input id="capacity" type="number" {...register("capacity")} />
      </div>
      <div className="lg:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4" />
          Guardar evento
        </Button>
      </div>
    </form>
  );
}
