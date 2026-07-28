import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SuccessPageClient } from "./success-client";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";

export const metadata: Metadata = {
  title: "Compra exitosa"
};

export default async function SuccessPage({
  params,
  searchParams
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{
    buyerName?: string;
    buyerEmail?: string;
    quantity?: string;
    eventTitle?: string;
    total?: string;
  }>;
}) {
  const { eventId } = await params;
  const { buyerName, buyerEmail, quantity, eventTitle, total } =
    await searchParams;

  const eventRepo = new EventMockRepository();
  const event = await eventRepo.getById(eventId);

  if (!event || !buyerName || !buyerEmail || !quantity) {
    notFound();
  }

  return (
    <SuccessPageClient
      eventId={eventId}
      eventTitle={eventTitle ?? event.title}
      buyerName={buyerName}
      buyerEmail={buyerEmail}
      quantity={parseInt(quantity, 10)}
      total={total ?? "0"}
    />
  );
}
