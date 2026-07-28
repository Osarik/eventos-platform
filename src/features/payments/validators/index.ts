import { z } from "zod";

export const checkoutFormSchema = z.object({
  buyerName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  buyerEmail: z.string().email("Correo electrónico inválido"),
  buyerPhone: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
  quantity: z.coerce
    .number()
    .min(1, "Debes comprar al menos 1 entrada")
    .max(10, "Máximo 10 entradas por compra")
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
