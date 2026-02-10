import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  isExclusive: boolean("is_exclusive").default(false),
});

export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  eventId: serial("event_id").references(() => events.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  instagramHandle: text("instagram_handle"),
  phone: text("phone").default("").notNull(),

  status: text("status").default("pending"), // pending, approved, declined
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertRsvpSchema = createInsertSchema(rsvps).omit({ id: true, createdAt: true, status: true });

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Rsvp = typeof rsvps.$inferSelect;
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
