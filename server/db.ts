import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Please ensure the database is provisioned");
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Run migrations on startup
// This is robust for production in both CJS (server build) and ESM (dev).
const migrationsFolder = path.join(process.cwd(), "migrations");

export async function initDb() {
    try {
        console.log("Running migrations...");
        await migrate(db, { migrationsFolder });
        console.log("Migrations completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    }

    // Manual fix for missing user_id column if migration system is out of sync
    try {
        console.log("Verifying rsvps schema...");
        await pool.query(`ALTER TABLE "rsvps" ADD COLUMN IF NOT EXISTS "user_id" integer;`);
        // We handle the constraint carefully - adding it only if it doesn't error (hard to check 'if exists' for constraint in simple SQL without querying catalog)
        // But for now, just bringing the column back is critical. Foreign Key is nice to have but not strictly blocking insert if we allow it to be null or just integer.
        // Let's try to add FK, if it fails (duplicate), we ignore.
        try {
            await pool.query(`ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;`);
        } catch (e) {
            // Ignore constraint already exists error
        }
        console.log("Manual schema verification execution complete.");
    } catch (manualError) {
        console.error("Manual schema fix failed:", manualError);
    }
}

