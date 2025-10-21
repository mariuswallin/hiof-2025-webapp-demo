"use server";

import { requestInfo } from "rwsdk/worker";
import { tasksService } from "../tasksService";

export async function editTaskAction(
  prevState: { id: string; name: string },
  formData: FormData
): Promise<{
  success: boolean;
  data?: { id: string; name: string };
  error?: { message: string; code?: number };
}> {
  try {
    // Use ctx to validate user permissions if needed
    const { ctx } = requestInfo;

    const rawData = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
    };

    console.log(
      "Editing task with data:",
      rawData,
      "and prevState:",
      prevState
    );

    const taskItem = await tasksService.getById(rawData.id);

    // TODO: Validate input data

    if (!taskItem.success) {
      return {
        ...prevState,
        success: false,
        error: {
          message: "Validation failed",
          code: 404,
        },
      };
    }

    const result = await tasksService.update(rawData.id, {
      name: rawData.name,
    });

    if (!result.success) {
      return {
        ...result,
        success: false,
        data: rawData,
      };
    }

    const task = {
      id: result.data.id,
      name: result.data.name,
    };

    console.log("Task edited successfully:", result);

    return {
      success: true,
      data: task,
    };
  } catch (error) {
    console.error("Error in createTaskAction:", error);
    return {
      success: false,
      error: {
        message: "An unexpected error occurred. Please try again later.",
        code: 500,
      },
      data: Object.fromEntries(formData.entries()) as {
        id: string;
        name: string;
      },
    };
  }
}
