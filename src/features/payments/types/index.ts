import type { PaymentProvider } from "@/types/database";

export type PaymentProviderType = PaymentProvider;

export type CheckoutDraft = {
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  quantity: number;
};

export type CheckoutResponse = {
  status: "success" | "error" | "not_implemented";
  transactionId?: string;
  redirectUrl?: string;
  message?: string;
};

export type PaymentProviderConfig = Record<string, string>;

export interface PaymentProviderInterface {
  name: PaymentProviderType;
  createCheckout(draft: CheckoutDraft): Promise<CheckoutResponse>;
  verifyTransaction(transactionId: string): Promise<{
    status: string;
    amount: number;
  }>;
  processWebhook(payload: unknown): Promise<{
    transactionId: string;
    status: string;
  }>;
}
