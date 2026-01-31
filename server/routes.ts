import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Events API
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  });

  app.post(api.events.create.path, async (req, res) => {
    try {
      const input = api.events.create.input.parse(req.body);
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // RSVPs API
  app.post(api.rsvps.create.path, async (req, res) => {
    try {
      const input = api.rsvps.create.input.parse(req.body);
      const rsvp = await storage.createRsvp(input);
      res.status(201).json(rsvp);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingEvents = await storage.getEvents();
  if (existingEvents.length === 0) {
    const today = new Date();
    
    // Event 1: Next Friday
    const event1Date = new Date(today);
    event1Date.setDate(today.getDate() + (5 + 7 - today.getDay()) % 7);
    event1Date.setHours(22, 0, 0, 0);

    // Event 2: A month later
    const event2Date = new Date(today);
    event2Date.setMonth(today.getMonth() + 1);
    event2Date.setHours(21, 0, 0, 0);

    await storage.createEvent({
      title: "Velvyt Launch: Genesis",
      description: "The beginning of a new era. Experience the unseen.",
      date: event1Date,
      location: "Secret Warehouse, DTLA",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80",
      isExclusive: true,
    });

    await storage.createEvent({
      title: "Midnight Mirage",
      description: "A rooftop experience under the stars. High fashion, high altitude.",
      date: event2Date,
      location: "Sky Lounge, Hollywood",
      imageUrl: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80",
      isExclusive: false,
    });
    
    await storage.createEvent({
      title: "Neon Shadows",
      description: "Underground vibes. Strict dress code.",
      date: new Date(today.setMonth(today.getMonth() + 2)),
      location: "The Bunker, Brooklyn",
      imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80",
      isExclusive: true,
    });
  }
}
