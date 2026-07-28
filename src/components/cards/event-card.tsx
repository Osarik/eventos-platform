import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/format";

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="overflow-hidden rounded-lg border bg-card">
      <div className="relative aspect-[16/10]">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant={event.status === "active" ? "success" : "secondary"}>
            {event.status}
          </Badge>
          <span className="text-sm font-medium">
            {formatCurrency(event.price)}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {event.description}
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {formatDate(event.startsAt)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {event.venue}, {event.city}
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href={`/eventos/${event.slug}`}>Ver evento</Link>
        </Button>
      </div>
    </article>
  );
}
