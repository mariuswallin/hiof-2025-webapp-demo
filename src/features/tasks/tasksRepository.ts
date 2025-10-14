import { db, type DB } from "@/db";
import {
  tasks,
  type Task,
  CreateTask,
  type TaskQueryParams,
  type UpdateTask,
} from "@/db/schema";
import { createId } from "@/lib/id";
import type { Result } from "@/types/result";
import { eq } from "drizzle-orm";

export interface TaskRepository {
  findMany(params?: TaskQueryParams): Promise<Result<Task[]>>;
  findById(id: string): Promise<Result<Task>>;
  create(data: CreateTask): Promise<Result<Task>>;
  update(id: string, data: UpdateTask): Promise<Result<Task>>;
}

export function createTaskRepository(db: DB): TaskRepository {
  return {
    async findMany(params = {}) {
      try {
        const transformParams = {
          published: (params: TaskQueryParams) => {
            return params.published === "true";
          },
        };

        console.log("Transforming params:", params);

        const publishedQuery = eq(
          tasks.published,
          transformParams.published(params)
        );

        const result = await db
          .select()
          .from(tasks)
          .where(publishedQuery)
          .orderBy(tasks.dueDate);

        return { success: true, data: result };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 500,
            message:
              (error as Error)?.message ?? "Failed to fetch tasks from DB",
          },
        };
      }
    },
    async findById(id: string) {
      try {
        const task = await db.query.tasks.findFirst({
          where: eq(tasks.id, id),
          with: { user: true },
        });

        if (!task) {
          return {
            success: false,
            error: { code: 404, message: "Task not found" },
          };
        }

        return { success: true, data: task };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 500,
            message:
              (error as Error)?.message ?? "Failed to fetch task from DB",
          },
        };
      }
    },
    async create(data: CreateTask) {
      try {
        const [newTask] = await db
          .insert(tasks)
          .values({
            id: createId(),
            name: data.name,
            description: data.description,
            dueDate: data.dueDate ?? new Date(),
            userId: data.userId,
            completed: data.completed ?? false,
            published: data.published ?? false,
          })
          .returning();

        return { success: true, data: newTask };
      } catch (error) {
        console.log("Error creating task:", error);
        return {
          success: false,
          error: {
            code: 500,
            message: (error as Error)?.message ?? "Failed to create task in DB",
          },
        };
      }
    },
    async update(id, data) {
      try {
        const [updatedTask] = await db
          .update(tasks)
          .set(data)
          .where(eq(tasks.id, id))
          .returning();

        return { success: true, data: updatedTask };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 500,
            message: (error as Error)?.message ?? "Failed to update task in DB",
          },
        };
      }
    },
  };
}

export const taskRepository = createTaskRepository(db);
