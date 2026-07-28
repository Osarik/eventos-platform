import type {
  PaymentProviderInterface,
  CheckoutDraft,
  CheckoutResponse
} from "@/features/payments/types";
import { registerProvider } from "./payment-provider";

class WompiProvider implements PaymentProviderInterface {
  name = "wompi" as const;

  async createCheckout(_draft: CheckoutDraft): Promise<CheckoutResponse> {
    void _draft;
    return {
      status: "not_implemented",
      message: "Wompi será conectado en un sprint posterior"
    };
  }

  async verifyTransaction(
    _transactionId: string
  ): Promise<{ status: string; amount: number }> {
    void _transactionId;
    return { status: "pending", amount: 0 };
  }

  async processWebhook(
    _payload: unknown
  ): Promise<{ transactionId: string; status: string }> {
    void _payload;
    return { transactionId: "", status: "pending" };
  }
}

const wompiProvider = new WompiProvider();
registerProvider(wompiProvider);

export { wompiProvider };
