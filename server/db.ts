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
        // Continue anyway, maybe it's just a connection issue or already applied
    }
}

