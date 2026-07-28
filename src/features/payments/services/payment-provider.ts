import type {
  PaymentProviderInterface,
  PaymentProviderType,
  CheckoutDraft,
  CheckoutResponse
} from "@/features/payments/types";

const providers = new Map<PaymentProviderType, PaymentProviderInterface>();

export function registerProvider(provider: PaymentProviderInterface): void {
  providers.set(provider.name, provider);
}

export function getProvider(
  name: PaymentProviderType
): PaymentProviderInterface {
  const provider = providers.get(name);
  if (!provider) {
    throw new Error(`Payment provider "${name}" is not registered`);
  }
  return provider;
}

export async function createCheckout(
  providerName: PaymentProviderType,
  draft: CheckoutDraft
): Promise<CheckoutResponse> {
  const provider = getProvider(providerName);
  return provider.createCheckout(draft);
}

export async function verifyTransaction(
  providerName: PaymentProviderType,
  transactionId: string
): Promise<{ status: string; amount: number }> {
  const provider = getProvider(providerName);
  return provider.verifyTransaction(transactionId);
}

export async function processWebhook(
  providerName: PaymentProviderType,
  payload: unknown
): Promise<{ transactionId: string; status: string }> {
  const provider = getProvider(providerName);
  return provider.processWebhook(payload);
}
