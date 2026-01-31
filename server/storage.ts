import {
  type Event,
  type InsertEvent,
  type Rsvp,
  type InsertRsvp
} from "@shared/schema";

export interface IStorage {
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
}

// TEMP: in-memory storage (NO DATABASE)
export class DatabaseStorage implements IStorage {
  private events: Event[] = [];
  private rsvps: Rsvp[] = [];
  private eventId = 1;
  private rsvpId = 1;

  async getEvents(): Promise<Event[]> {
    return this.events;
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.find(e => e.id === id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const event: Event = {
      id: this.eventId++,
      ...insertEvent,
    } as Event;

    this.events.push(event);
    return event;
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const rsvp: Rsvp = {
      id: this.rsvpId++,
      ...insertRsvp,
    } as Rsvp;

    this.rsvps.push(rsvp);
    return rsvp;
  }
}

export const storage = new DatabaseStorage();
