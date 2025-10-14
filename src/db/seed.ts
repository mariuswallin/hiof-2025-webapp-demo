// src/db/seed.ts

import { defineScript } from "rwsdk/worker";
import { drizzle } from "drizzle-orm/d1";
import { users, type Task, tasks } from "./schema";

export default defineScript(async ({ env }) => {
  try {
    const db = drizzle(env.DB);
    await db.delete(users);
    await db.delete(tasks);

    const [user1] = await db
      .insert(users)
      .values({
        name: "Test user",
        email: "test@testuser.io",
      })
      .returning();

    const taskData: Task[] = [
      {
        id: "1",
        name: "Task 1",
        description: "Description for Task 1",
        dueDate: new Date(Date.now() + 86400 * 1000),
        userId: user1.id,
        completed: false,
        published: true,
      },
      {
        id: "2",
        name: "Task 2",
        description: "Description for Task 2",
        dueDate: new Date(Date.now() + 172800 * 1000), // Due in 2 days
        userId: user1.id,
        completed: false,
        published: false,
      },
    ];

    const [...insertedTasks] = await db
      .insert(tasks)
      .values(taskData)
      .returning();

    const result = await db.select().from(users).all();
    console.log("Inserted tasks:", insertedTasks);

    console.log("🌱 Finished seeding");

    return Response.json(result);
  } catch (error) {
    console.error("Error seeding database:", error);
    return Response.json({
      success: false,
      error: "Failed to seed database",
    });
  }
});
