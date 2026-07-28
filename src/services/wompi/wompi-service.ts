type CheckoutDraft = {
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  quantity: number;
};

export async function createWompiCheckout(draft: CheckoutDraft) {
  void draft;

  return {
    status: "not_implemented" as const,
    message: "Wompi sera conectado en un sprint posterior."
  };
}
