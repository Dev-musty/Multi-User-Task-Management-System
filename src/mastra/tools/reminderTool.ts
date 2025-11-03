import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { addTask, Task } from "../../database/db";

export interface ReminderInput {
  assignedBy: string;
  assignedTo: string;
  task: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}
export const reminderTool = createTool({
  id: "reminder-tool",
  description: "Creates a task/reminder and assigns it to a team member",
  inputSchema: z.object({
    assignedBy: z.string().describe("Whose creating the task"),
    assignedTo: z.string().describe("Who is doing the task"),
    task: z.string().describe("What to remind about"),
    dueDate: z.string().describe("When the task will be due"),
    priority: z.enum(["low", "medium", "high"]),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    taskId: z.string().optional(),
  }),
  execute: async ({ context }) => {
    return await createReminder(context);
  },
});

export const createReminder = async (context:ReminderInput) => {
  const { assignedBy, assignedTo, task, dueDate, priority } = context;
  try {
    const due = new Date(dueDate);
    const now = new Date();
    // check if the the due date is set to current date or past date
    if (due < now) {
      return {
        success: false,
        message: `Due date must be in the future.\n\nprovided: ${due.toLocaleString()} | current: ${now.toLocaleString()}`,
      };
    }
    // set up reminders
    let reminder: Date;
    const timeUntilDue = due.getTime() - now.getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const anHrInMs = 60 * 60 * 1000;
    if (priority === "high" && timeUntilDue > oneDayInMs) {
      // one ahead reminder
      reminder = new Date(due.getTime() - oneDayInMs);
    } else if (timeUntilDue > anHrInMs) {
      // an hour ahead reminder
      reminder = new Date(due.getTime() - anHrInMs);
    } else {
      reminder = now;
    }
    // create reminder
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTask: Task = {
      id,
      assignedTo,
      assignedBy,
      task,
      dueDate: due.toISOString(), // Store as ISO string
      reminder: reminder.toISOString(), // Store as ISO string
      completed: false,
      createdAt: now.toISOString(),
      priority,
    };
    await addTask(newTask);
    // format the dueDate
    const dueFormatted = due.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    return {
      success: true,
      message: `Task assigned to ${assignedTo}!\n\nPriority: ${priority}\nTask: ${task}\n Due: ${dueFormatted}\nAssigned by: ${assignedBy}`,
      taskId: id,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create reminder: ${error}`,
    };
  }
};
