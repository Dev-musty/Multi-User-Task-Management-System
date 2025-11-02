// src/tools/completeTaskTool.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getUserTasks, updateTask } from "../../database/db";

interface User {
  user: string;
}
export const completeTask = createTool({
  id: "complete-task",
  description: "Marks a task as completed",
  inputSchema: z.object({
    user: z.string().describe("Username"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    return await markTaskComplete(context);
  },
});
const markTaskComplete = async (context: User) => {
  const { user } = context;
  try {
    // Get user's tasks
    const userTasks = await getUserTasks(user);

    // Find incomplete task
    const task = userTasks.find((t) => !t.completed);

    if (!task) {
      return {
        success: false,
        message: `No pending task found for ${user}`,
      };
    }

    // Mark as completed
    await updateTask(task.id, {
      completed: true,
      completedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: `Task completed!\n\n~~${task.task}~~\n\nGreat work, ${user}! 🎉`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error completing task: ${error}`,
    };
  }
};
