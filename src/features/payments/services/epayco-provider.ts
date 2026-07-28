import type {
  PaymentProviderInterface,
  CheckoutDraft,
  CheckoutResponse
} from "@/features/payments/types";
import { registerProvider } from "./payment-provider";

class EpaycoProvider implements PaymentProviderInterface {
  name = "epayco" as const;

  async createCheckout(draft: CheckoutDraft): Promise<CheckoutResponse> {
    const isDemo = !process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY;

    if (isDemo) {
      return {
        status: "success",
        transactionId: `demo_${Date.now()}`,
        redirectUrl: `/checkout/${draft.eventId}/payment?buyerName=${encodeURIComponent(draft.buyerName)}&buyerEmail=${encodeURIComponent(draft.buyerEmail)}&buyerPhone=${encodeURIComponent(draft.buyerPhone)}&quantity=${draft.quantity}`,
        message: "Modo demostración — ePayco simulado"
      };
    }

    const epayco = await import("epayco-sdk-node").then((mod) =>
      mod.default({
        apiKey: process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY,
        privateKey: process.env.EPAYCO_PRIVATE_KEY,
        lang: "ES",
        test: true
      })
    );

    const paymentInfo = {
      name: draft.buyerName,
      last_name: draft.buyerName.split(" ").slice(1).join(" ") || "Cliente",
      email: draft.buyerEmail,
      phone: draft.buyerPhone,
      bill: `FAC-${Date.now()}`,
      description: `Compra entradas evento ${draft.eventId}`,
      value: "0",
      tax: "0",
      tax_base: "0",
      currency: "COP",
      dues: "12",
      ip: "0.0.0.0",
      url_response: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${draft.eventId}/success`,
      url_confirmation: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/epayco`,
      method_confirmation: "POST"
    };

    const charge = await epayco.charge.create(paymentInfo);
    return {
      status: "success",
      transactionId: charge.data?.ref_payco,
      redirectUrl: charge.data?.url_payment,
      message: "Redirigiendo a ePayco..."
    };
  }

  async verifyTransaction(
    _transactionId: string
  ): Promise<{ status: string; amount: number }> {
    void _transactionId;
    return { status: "approved", amount: 0 };
  }

  async processWebhook(
    _payload: unknown
  ): Promise<{ transactionId: string; status: string }> {
    void _payload;
    return { transactionId: "", status: "approved" };
  }
}

const epaycoProvider = new EpaycoProvider();
registerProvider(epaycoProvider);

export { epaycoProvider };
