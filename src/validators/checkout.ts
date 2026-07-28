import { z } from "zod";

export const checkoutSchema = z.object({
  buyerName: z.string().min(2, "Ingresa tu nombre."),
  buyerEmail: z.string().email("Ingresa un correo valido."),
  buyerPhone: z.string().min(7, "Ingresa un telefono valido."),
  quantity: z.coerce.number().min(1).max(10)
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
