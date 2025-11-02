// src/tools/getAssignedTasksTool.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getTasksByAssigner, Task } from "../../database/db";

interface User {
  assignedBy: string;
}
export const getAssignedTasks = createTool({
  id: "get-assigned-tasks",
  description: "Gets all tasks that are assigned to someone",
  inputSchema: z.object({
    assignedBy: z.string().describe("Username of who assigned the tasks"),
  }),
  outputSchema: z.object({
    totalTasks: z.number(),
    completedTasks: z.number(),
    notCompletedTasks: z.number(),
    overview: z.string(),
  }),
  execute: async ({ context }) => {
    return await assignedTask(context);
  },
});

const assignedTask = async (context: User) => {
  const { assignedBy } = context;
  try {
    const assigner = await getTasksByAssigner(assignedBy);
    if (assigner.length === 0) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        notCompletedTasks: 0,
        overview: `You haven't assigned any tasks yet`,
      };
    }

    // get the task assigned by someone that has been complete or not
    const completed = assigner.filter((t) => t.completed);
    const notCompleted = assigner.filter((t) => !t.completed);

    // Group by assignee
    const byAssignee = assigner.reduce(
      (acc, task) => {
        if (!acc[task.assignedTo]) {
          acc[task.assignedTo] = { notCompleted: [], completed: [] };
        }
        if (task.completed) {
          acc[task.assignedTo].completed.push(task);
        } else {
          acc[task.assignedTo].notCompleted.push(task);
        }
        return acc;
      },
      {} as Record<string, { notCompleted: Task[]; completed: Task[] }>
    );

    // Build overview
    let output = `Task Overview for ${assignedBy}\n\n`;
    output += `Total: ${assigner.length} | Completed: ${completed.length} | Not completed: ${notCompleted.length}\n\n`;

    // List by team member
    output += `Team Progress:\n\n`;
    Object.entries(byAssignee).forEach(([member, tasks]) => {
      const total = tasks.completed.length + tasks.notCompleted.length;
      const completionRate =
        total > 0 ? Math.round((tasks.completed.length / total) * 100) : 0;

      output += `${member} (${completionRate}% complete)\n`;

      // notCompleted tasks
      if (tasks.notCompleted.length > 0) {
        output += ` notCompleted:\n`;
        tasks.notCompleted.forEach((task) => {
          const due = new Date(task.dueDate);
          const dueFormatted = due.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          output += `${task.task} (Due: ${dueFormatted})\n`;
        });
      }

      // Completed tasks
      if (tasks.completed.length > 0) {
        output += `Completed: ${tasks.completed.length} task${tasks.completed.length > 1 ? "s" : ""}\n`;
      }

      output += `\n`;
    });

    return {
      totalTasks: assigner.length,
      completedTasks: completed.length,
      notCompletedTasks: notCompleted.length,
      overview: output,
    };
  } catch (error) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      overview: `Error fetching tasks: ${error}`,
    };
  }
};
