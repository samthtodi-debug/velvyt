import { Pool, type PoolConfig } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
    );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Run migrations on startup
// This is robust for production.
const migrationsFolder = path.join(__dirname, "../migrations");

// We don't await here because db export is synchronous, but migrations are async. 
// We should ideally run this before the app starts listening.
// However, since this file is imported, we can export a function to init DB.

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

