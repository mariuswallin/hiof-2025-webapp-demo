import type { Result } from "@/types/result";
import { taskRepository, type TaskRepository } from "./tasksRepository";
import type { CreateTask, Task, TaskQueryParams } from "@/db/schema";

export interface TaskService {
  list(params?: TaskQueryParams): Promise<Result<Task[]>>;
  getById(id: string): Promise<Result<Task>>;
  create(data: any): Promise<Result<Task>>;
  update(id: string, data: any): Promise<Result<Task>>;
}

export function createTaskService(taskRepository: TaskRepository): TaskService {
  return {
    async list(params = {}) {
      const { search = "" } = params;
      // TODO: Add fancy search logic here
      if (search.includes("haxxor")) {
        return {
          success: false,
          error: {
            message: "Invalid search term",
            code: 400,
          },
        };
      }

      const repositoryResult = await taskRepository.findMany(params);

      if (!repositoryResult.success) {
        return repositoryResult;
      }

      const { data } = repositoryResult;

      return {
        success: true,
        data: data || [],
      };
    },
    async getById(id: string) {
      const repositoryResult = await taskRepository.findById(id);

      if (!repositoryResult.success) {
        return repositoryResult;
      }

      const { data } = repositoryResult;

      return {
        success: true,
        data,
      };
    },
    async create(data: CreateTask) {
      return taskRepository.create(data);
    },
    async update(id: string, data: any) {
      return taskRepository.update(id, data);
    },
  };
}

export const tasksService = createTaskService(taskRepository);
