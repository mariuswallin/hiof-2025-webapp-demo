import type { RequestInfo } from "rwsdk/worker";
import { tasksService, type TaskService } from "./tasksService";

// const taskServiceMock = {
//   getAllTasks: () => console.log('Mock getAllTasks called'),
//   getTaskById: () => console.log('Mock getTaskById called'),
//   createTask: () => console.log('Mock createTask called'),
// };

// const dummyTaskController = createTaskController(taskServiceMock);

export function createTaskController(taskService: TaskService) {
  return {
    // GET /api/v1/tasks - List all tasks
    // GET /api/v1/tasks?search=foo - Search tasks
    async listTasks(context: RequestInfo) {
      try {
        const searchParams = new URL(context.request.url).searchParams;
        const searchEntries = Object.fromEntries(searchParams.entries());
        const dataFromService = await taskService.list(searchEntries);

        if (!dataFromService.success) {
          return new Response(JSON.stringify(dataFromService), {
            status: dataFromService.error.code || 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(
          JSON.stringify({
            ...dataFromService,
            params: searchEntries,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch {
        return new Response(
          JSON.stringify({
            error: "Failed to list tasks",
            success: false,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    },
    async getTask(context: RequestInfo) {
      const { id } = context.params;
      const serviceResult = await taskService.getById(id);
      return new Response(JSON.stringify(serviceResult), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
    async createTask(context: RequestInfo) {
      const data = await context.request.json();
      const serviceResult = await taskService.create(data);
      return new Response(JSON.stringify(serviceResult), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    },
    async updateTask(context: RequestInfo) {
      const { id } = context.params;
      const data = await context.request.json();
      // const dataFromService = await taskService.update(id, data);
      return new Response(
        JSON.stringify({
          data: `Task with id ${id} updated with data ${JSON.stringify(data)}`,
          success: true,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    },
  };
}

export const tasksController = createTaskController(tasksService);
