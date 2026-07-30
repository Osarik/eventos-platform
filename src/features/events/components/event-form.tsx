"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Save, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  eventFormSchema,
  type EventFormValues
} from "@/features/events/validators";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";

const repo = new EventMockRepository();

export function EventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      status: "draft",
      price: 0,
      capacity: 100
    }
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  function clearFile() {
    setPreview(null);
  }

  async function onSubmit(values: EventFormValues) {
    const slug = values.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await repo.create({
      owner_id: "user_demo",
      organization_id: "org_001",
      slug,
      title: values.title,
      description: values.description,
      venue: values.venue,
      city: values.city,
      address: values.address,
      starts_at: new Date(values.startsAt).toISOString(),
      price_cop: values.price,
      capacity: values.capacity,
      status: values.status,
      image_path: preview ?? undefined
    });

    reset();
    clearFile();
    onSuccess?.();
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
        <Label htmlFor="flyer">Flyer del evento</Label>
        <div className="flex items-start gap-4">
          {preview ? (
            <div className="relative aspect-[3/4] w-32 overflow-hidden rounded-md border">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={clearFile}
                className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="flex aspect-[3/4] w-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed text-muted-foreground hover:border-primary hover:text-primary">
              <ImagePlus className="h-6 w-6" />
              <span className="mt-1 text-xs">Subir</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </label>
          )}
        </div>
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
