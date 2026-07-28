import { wompiProvider } from "@/features/payments/services/wompi-provider";

export const createWompiCheckout =
  wompiProvider.createCheckout.bind(wompiProvider);
