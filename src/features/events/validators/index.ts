import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres"),
  category: z.string().optional(),
  venue: z.string().min(2, "El lugar debe tener al menos 2 caracteres"),
  city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  startsAt: z.string().min(1, "La fecha de inicio es requerida"),
  endsAt: z.string().optional(),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  capacity: z.coerce.number().min(1, "La capacidad debe ser al menos 1"),
  status: z.enum(["draft", "active", "paused", "finished"]).default("draft"),
  imageUrl: z.string().optional()
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
