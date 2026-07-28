import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().min(20, "Agrega una descripcion mas completa."),
  venue: z.string().min(2, "Indica el lugar del evento."),
  city: z.string().min(2, "Indica la ciudad."),
  address: z.string().min(5, "Indica una direccion valida."),
  startsAt: z.string().min(1, "Selecciona fecha y hora."),
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),
  capacity: z.coerce.number().min(1, "La capacidad debe ser mayor a cero."),
  status: z.enum(["draft", "active", "paused", "finished"])
});

export type EventFormValues = z.infer<typeof eventSchema>;
