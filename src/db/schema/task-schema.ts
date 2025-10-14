import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user-schema";
import { relations } from "drizzle-orm";
import { createId } from "@/lib/id";

export const tasks = sqliteTable(
  "tasks",
  {
    id: text("id")
      .primaryKey()
      .$default(() => createId()),
    name: text("name").notNull(),
    description: text("description").notNull(),
    dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    completed: integer("completed", { mode: "boolean" }).default(false),
    published: integer("published", { mode: "boolean" }).default(false),
  },
  (table) => [
    index("idx_tasks_user_id").on(table.userId),
    index("completed_idx").on(table.completed),
  ]
);

export const taskRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
}));

export type Task = typeof tasks.$inferSelect;
export type CreateTask = typeof tasks.$inferInsert;
export type UpdateTask = Partial<CreateTask>;
export type TaskQueryParams = {
  search?: string;
  published?: string;
};
export type TaskWithUser = Task & { user: { id: number; name: string } };
