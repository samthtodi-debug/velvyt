import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import Razorpay from "razorpay";

import { setupAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup Authentication
  setupAuth(app);

  // Initialize Razorpay conditionally to prevent crashes on deploy if keys are missing
  let razorpay: Razorpay | null = null;
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    console.warn("Razorpay keys missing. Payment integration will be disabled.");
  }

  // Create Payment Order
  app.post("/api/create-payment-order", async (req, res) => {
    if (!razorpay) {
      return res.status(503).json({ error: "Payment service unavailable (Configuration missing)" });
    }

    try {
      const { amount } = req.body;
      const options = {
        amount: amount || 50000, // Default 500 INR in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      console.error("Razorpay Error:", error);
      res.status(500).json({ error: "Failed to create payment order" });
    }
  });

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

  app.get(api.rsvps.get.path, async (req, res) => {
    const rsvp = await storage.getRsvp(Number(req.params.id));
    if (!rsvp) {
      return res.status(404).json({ message: 'RSVP not found' });
    }
    res.json(rsvp);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingEvents = await storage.getEvents();

  const genesisImg = "/images/genesis.jpg";
  const mirageImg = "/images/mirage.jpg";
  const shadowsImg = "/images/shadows.jpg";

  if (existingEvents.length === 0) {
    const today = new Date();

    // Event 1: Genesis (updated)
    const event1Date = new Date("2026-03-14T18:00:00+05:30");

    // Event 2: A month later
    const event2Date = new Date(today);
    event2Date.setMonth(today.getMonth() + 1);
    event2Date.setHours(21, 0, 0, 0);

    await storage.createEvent({
      title: "Velvyt Launch: Genesis",
      description: "The beginning of a new era. Experience the unseen.",
      date: event1Date,
      location: "Secret Warehouse, Jaipur",
      imageUrl: genesisImg,
      isExclusive: true,
    });

    await storage.createEvent({
      title: "Midnight Mirage",
      description: "A rooftop experience under the stars. High fashion, high altitude.",
      date: event2Date,
      location: "Ur mum's place, Jaipur",
      imageUrl: mirageImg,
      isExclusive: false,
    });

    await storage.createEvent({
      title: "Neon Shadows",
      description: "Underground vibes. Strict dress code.",
      date: new Date(today.setMonth(today.getMonth() + 2)),
      location: "The Bunker, Jaipur",
      imageUrl: shadowsImg,
      isExclusive: true,
    });
  } else {
    // Update existing events with new local images if they match titles
    // Update existing events
    for (const event of existingEvents) {
      if (event.title === "Velvyt Launch: Genesis") {
        const updates: any = {};
        if (event.imageUrl !== genesisImg) updates.imageUrl = genesisImg;

        // Update date to 03.14.26 6:00 PM IST
        const genesisDate = new Date("2026-03-14T18:00:00+05:30");
        if (event.date.getTime() !== genesisDate.getTime()) {
          updates.date = genesisDate;
        }

        if (Object.keys(updates).length > 0) {
          await storage.updateEvent(event.id, updates);
          console.log(`Updated details for ${event.title}`);
        }
      }

      if (event.title === "Midnight Mirage") {
        const updates: any = {};
        if (event.imageUrl !== mirageImg) updates.imageUrl = mirageImg;
        // Check if date needs update
        const comingSoonDate = new Date("2099-01-01T00:00:00.000Z");
        if (event.date.getTime() !== comingSoonDate.getTime()) {
          updates.date = comingSoonDate;
        }

        if (Object.keys(updates).length > 0) {
          await storage.updateEvent(event.id, updates);
          console.log(`Updated details for ${event.title}`);
        }
      }

      if (event.title === "Neon Shadows") {
        const updates: any = {};
        if (event.imageUrl !== shadowsImg) updates.imageUrl = shadowsImg;
        const comingSoonDate = new Date("2099-01-01T00:00:00.000Z");
        if (event.date.getTime() !== comingSoonDate.getTime()) {
          updates.date = comingSoonDate;
        }
        if (event.location !== "Jaipur") {
          updates.location = "Jaipur";
        }

        if (Object.keys(updates).length > 0) {
          await storage.updateEvent(event.id, updates);
          console.log(`Updated details for ${event.title}`);
        }
      }
    }
  }
}
