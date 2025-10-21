"use client";

import { useEffect, useState } from "react";
import type { Task } from "../../../db/schema";
import { useAuth } from "@/hooks/useAuth";

export default function TaskDetailOld({
  params,
}: {
  params: { taskId: string };
}) {
  const user = useAuth();
  const { taskId } = params;

  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    try {
      const fetchTask = async () => {
        const response = await fetch(`/api/v1/tasks/${taskId}`);
        const fetchedTask = await response.json();
        console.log(fetchedTask);
        setTask(fetchedTask.data);
      };
      fetchTask();
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  }, [taskId]);
  return (
    <div>
      {JSON.stringify(task)}
      <p>{user?.name}</p>
    </div>
  );
}
