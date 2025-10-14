// src/db/index.ts

import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as schema from "./schema";

export const db = drizzle(env.DB, { schema });

export type DB = DrizzleD1Database<typeof schema>;
