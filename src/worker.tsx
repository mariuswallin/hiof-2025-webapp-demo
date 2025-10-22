import { defineApp, type RequestInfo } from "rwsdk/worker";
import { layout, prefix, render, route } from "rwsdk/router";
import { Document } from "@/app/Document";

import { User, users } from "./db/schema/user-schema";
import { setCommonHeaders } from "./app/headers";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { taskRoutes } from "./features/tasks/tasksRoutes";
import TaskListPage from "./features/tasks/pages/TaskListPage";
import { type DB } from "./db";
import { seedData } from "./db/seed";
import TaskDetailRSC from "./features/tasks/pages/TaskDetailRSC";
import TaskDetailOld from "./features/tasks/pages/TaskDetailOld";
import TaskEdit from "./features/tasks/pages/TaskEdit";
import TaskEditOld from "./features/tasks/pages/TaskEditOld";
import { MainLayout } from "./components/Layout";

export interface Env {
  DB: DB;
}

export type AppContext = {
  user: User | undefined;
  authUrl: string;
};

const fakeSetUserContext = async (context: RequestInfo) => {
  const { ctx } = context;
  ctx.user = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
  };
  ctx.user = undefined;
};

export default defineApp([
  setCommonHeaders(),
  fakeSetUserContext, // Run for all routes
  route("/api/seed", async () => {
    await seedData(env);
    return Response.json({ success: true });
  }), // Seed database route (for windows)
  prefix("/api/v1/tasks", taskRoutes), // API routes with controllers, services etc.
  render(Document, [
    route("/", async () => {
      // Simple example showing how to use the db directly in the route
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
      }, // Run for all /tasks routes
      layout(MainLayout, [
        route("/", TaskListPage), // Page using RSC
        route("/rsc/:taskId", TaskDetailRSC), // Page using RSC with params
        route("/old/:taskId", ({ params }) => (
          <TaskDetailOld params={params} /> // Page using regular rendering with params
        )),
        route("/:taskId/edit", TaskEdit), //  Page using server actions with params
        route("/old/:taskId/edit", ({ params }) => (
          <TaskEditOld params={params} />
        )), //  Page using regular pattern for update
      ]),
    ]),
  ]),
]);
