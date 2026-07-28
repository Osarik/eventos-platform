import { EventMockRepository } from "@/features/events/services/event-mock-repository";

const repo = new EventMockRepository();

export const listEvents = () => repo.list();
export const listActiveEvents = () => repo.listActive();
export const getEventBySlug = (slug: string) => repo.getBySlug(slug);
export const getEventById = (id: string) => repo.getById(id);
export const getEventStats = () => repo.getStats();
