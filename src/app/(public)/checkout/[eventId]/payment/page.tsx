import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaymentPageClient } from "./payment-client";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";

export const metadata: Metadata = {
  title: "Pago con ePayco"
};

export default async function PaymentPage({
  params,
  searchParams
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{
    buyerName?: string;
    buyerEmail?: string;
    buyerPhone?: string;
    quantity?: string;
  }>;
}) {
  const { eventId } = await params;
  const { buyerName, buyerEmail, buyerPhone, quantity } = await searchParams;

  const eventRepo = new EventMockRepository();
  const event = await eventRepo.getById(eventId);

  if (!event || !buyerName || !buyerEmail || !quantity) {
    notFound();
  }

  const qty = parseInt(quantity, 10);
  const total = event.price_cop * qty;

  return (
    <PaymentPageClient
      eventId={eventId}
      eventTitle={event.title}
      buyerName={buyerName}
      buyerEmail={buyerEmail}
      buyerPhone={buyerPhone ?? ""}
      quantity={qty}
      unitPrice={event.price_cop}
      total={total}
    />
  );
}
