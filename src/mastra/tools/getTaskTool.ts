import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getUserTasks } from "../../database/db";
interface User {
  user: string;
}

export const getTasks = createTool({
  id: "Get-tasks",
  description: "Gets all tasks assigned to a specific user",
  inputSchema: z.object({
    user: z.string().describe("username"),
  }),
  outputSchema: z.object({
    taskCount: z.number(),
    tasks: z.string(),
  }),
  execute: async ({ context }) => {
    return await listReminders(context);
  },
});

const listReminders = async (context: User) => {
  const { user } = context;
  try {
    const userTasks = await getUserTasks(user);
    if (userTasks.length === 0) {
      return {
        taskCount: 0,
        tasks: `No tasks assigned to ${user}`,
      };
    }
    //filter the user tasks by not completed and commpleted
    const notCompleted = userTasks.filter((task) => !task.completed);
    const completed = userTasks.filter((task) => task.completed);
    let output = `Tasks for ${user}: \n\n`;
    // not completed task
    if (notCompleted.length > 0) {
      notCompleted.length === 1 ? output += `(${notCompleted.length}) task not completed:\n\n`:`(${notCompleted.length}) tasks not completed:\n\n`;
      notCompleted.forEach((task, index) => {
        const due = new Date(task.dueDate);
        const dueFormatted = due.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
        if (task.assignedBy === user) {
          output += `${index + 1}. ${task.task}\n`;
          output += `   Due: ${dueFormatted}\n`;
        } else {
          output += `${index + 1}. ${task.task}\n`;
          output += `   Due: ${dueFormatted}\n`;
          output += `   Assigned by: ${task.assignedBy}\n\n`;
        }
      });
    }
    // Completed tasks
    if (completed.length > 0) {
      output += `(${completed.length})tasks completed:\n\n`;
      completed.forEach((task, index) => {
        output += `${index + 1}. ${task.task}\n`;
        if (task.completedAt) {
          const completedDate = new Date(task.completedAt);
          output += `   Completed: ${completedDate.toLocaleDateString()}\n`;
        }
        output += `\n`;
      });
    }
    return {
      taskCount: userTasks.length,
      tasks: output,
    };
  } catch (error) {
    return {
      message: `Failed to fetch reminder: ${error}`,
    };
  }
};
