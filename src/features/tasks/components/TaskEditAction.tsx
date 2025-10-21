"use client";

import type { Task } from "@/db/schema";
import { useActionState } from "react";
import { editTaskAction } from "../actions/editTaskAction";

export default function TaskEditAction({ task }: { task: Task }) {
  const [state, formAction, isPending] = useActionState(editTaskAction, {
    success: false,
    error: {
      message: "",
    },
    data: task
      ? {
          id: task.id,
          name: task.name,
        }
      : {},
  });

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-48 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
      </div>
    );
  }

  console.log("Current state:", state);

  return (
    <section>
      <h2>Edit {JSON.stringify(state)}</h2>
      <form action={formAction} className="space-y-4">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          minLength={3}
          maxLength={200}
          defaultValue={state?.data?.name}
          placeholder="F.eks. Ferdigstill prosjektdokumentasjon"
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500  border-gray-300`}
        />
        <input type="hidden" name="id" value={task.id} />
        <button type="submit">Save</button>
      </form>
    </section>
  );
}
