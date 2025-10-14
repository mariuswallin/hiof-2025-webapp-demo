import { route } from "rwsdk/router";
import { tasksController } from "./tasksController";

export const taskRoutes = [
  route("/", async (ctx) => {
    const method = ctx.request.method.toLowerCase();
    switch (method) {
      // GET /api/v1/tasks
      case "get":
        return tasksController.listTasks(ctx);
      // POST /api/v1/tasks
      case "post":
        return tasksController.createTask(ctx);
      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  }),
  route("/:id", (ctx) => {
    const method = ctx.request.method.toLowerCase();
    switch (method) {
      // GET /api/v1/tasks/:id
      case "get":
        return tasksController.getTask(ctx);
      case "patch":
      // PUT /api/v1/tasks/:id
      case "put":
        return tasksController.updateTask(ctx);
      // DELETE /api/v1/tasks/:id
      case "delete":
        return new Response(null, {
          status: 204,
          headers: { "Content-Type": "application/json" },
        });
      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  }),
  route("/:id/publish", (ctx) => {
    const { id } = ctx.params;
    const method = ctx.request.method.toLowerCase();
    const isInvalidMethod = ["get", "patch", "delete"].includes(method);

    if (isInvalidMethod) {
      return new Response("Method Not Allowed", { status: 405 });
    }

    return new Response(
      JSON.stringify({
        data: `Task with id ${id} published`,
        success: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
  route("/:id/tags/:tagId", (ctx) => {
    const { id, tagId } = ctx.params;

    return new Response(
      JSON.stringify({
        data: `Task with id ${id} and tag ${tagId}`,
        success: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
];
