import { defineApp, type RequestInfo } from "rwsdk/worker";
import { layout, prefix, render, route } from "rwsdk/router";
import { Document } from "@/app/Document";

import { User, users } from "./db/schema/user-schema";
import { setCommonHeaders } from "./app/headers";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { taskRoutes } from "./features/tasks/tasksRoutes";
import TaskListPage from "./features/tasks/pages/TaskListPage";
import { type DB, db } from "./db";
import { seedData } from "./db/seed";
import TaskDetailRSC from "./features/tasks/pages/TaskDetailRSC";
import TaskDetailOld from "./features/tasks/pages/TaskDetailOld";
import TaskEdit from "./features/tasks/pages/TaskEdit";
import { MainLayout } from "./components/Layout";

export interface Env {
  DB: DB;
}

export type AppContext = {
  user: User | undefined;
  authUrl: string;
};

const fakeSetUserContext = async (ctx: RequestInfo) => {
  ctx.ctx.user = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
  };
  ctx.ctx.user = undefined;
};

export default defineApp([
  setCommonHeaders(),
  fakeSetUserContext,
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
    prefix("/tasks", [
      () => {
        const loggedIn = true;
        if (!loggedIn) {
          return new Response("Unauthorized", { status: 401 });
        }
      },
      layout(MainLayout, [
        route("/", TaskListPage),
        route("/rsc/:taskId", TaskDetailRSC),
        route("/old/:taskId", ({ params }) => (
          <TaskDetailOld params={params} />
        )),
        route("/:taskId/edit", TaskEdit),
      ]),
    ]),
  ]),
]);
