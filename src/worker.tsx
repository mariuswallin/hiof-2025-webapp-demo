import { defineApp } from "rwsdk/worker";
import { prefix, render, route } from "rwsdk/router";
import { Document } from "@/app/Document";

import { User, users } from "./db/schema/user-schema";
import { setCommonHeaders } from "./app/headers";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { taskRoutes } from "./features/tasks/tasksRoutes";
import TaskListPage from "./features/tasks/pages/TaskListPage";
import { type DB, db } from "./db";
import { seedData } from "./db/seed";

export interface Env {
  DB: DB;
}

export type AppContext = {
  user: User | undefined;
  authUrl: string;
};

export default defineApp([
  setCommonHeaders(),
  route("/api/seed", async () => {
    await seedData(env);
    return Response.json({ success: true });
  }),
  prefix("/api/v1/tasks", taskRoutes),
  render(Document, [
    route("/", async () => {
      const userResult = await drizzle(env.DB).select().from(users);
      return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
          <h1>Start</h1>
          <p>Velkommen til eksempel</p>
          <p>Databasen har {userResult.length} brukere</p>
        </div>
      );
    }),
    route("/tasks", TaskListPage),
  ]),
]);
