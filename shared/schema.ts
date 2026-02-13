import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
  instagramHandle: text("instagram_handle"),
  avatarUrl: text("avatar_url").default("https://github.com/shadcn.png"),
  bio: text("bio").default(""),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

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
  userId: integer("user_id").references(() => users.id),
  eventId: integer("event_id").references(() => events.id),
  // Deprecating direct user details in rsvps in favor of userId, but keeping for backward compatibility if needed for now
  // Ideally we should migrate existing data or make these nullable if userId is present
  name: text("name").notNull(),
  email: text("email").notNull(),
  instagramHandle: text("instagram_handle"),
  phone: text("phone").default("").notNull(),
  referralSource: text("referral_source"),

  status: text("status").default("pending"), // pending, approved, declined
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, isAdmin: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertRsvpSchema = createInsertSchema(rsvps).omit({ id: true, createdAt: true, status: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Rsvp = typeof rsvps.$inferSelect;
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
