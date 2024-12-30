import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const runtime = 'nodejs';

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString);
export const db = drizzle(client); 