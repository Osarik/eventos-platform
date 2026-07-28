"use client";

import { useState, useEffect } from "react";
import type { Event, EventWithStats } from "@/features/events/types";
import { EventMockRepository } from "@/features/events/services/event-mock-repository";

const eventRepo = new EventMockRepository();

export function useEvents() {
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    eventRepo.getWithStats().then((data) => {
      setEvents(data);
      setIsLoading(false);
    });
  }, []);

  return { events, isLoading };
}

export function useActiveEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    eventRepo.listActive().then((data) => {
      setEvents(data);
      setIsLoading(false);
    });
  }, []);

  return { events, isLoading };
}
