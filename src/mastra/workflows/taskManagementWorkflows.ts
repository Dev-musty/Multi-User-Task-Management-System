import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { createReminder } from "../tools/reminderTool";
import { listReminders } from "../tools/getTaskTool";
import { assignedTask } from "../tools/getAssignedTaskTool";
import { markTaskComplete } from "../tools/completeTaskTool";
const reminder = createStep({
  id: "create-task-step",
  description: "Creates a task using the reminder tool",
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
    if (!context) {
      throw new Error("Input data not found");
    }
    return await createReminder(context);
  },
});
const getTask = createStep({
  id: "get-task-step",
  description: "Get user tasks",
  inputSchema: z.object({
    user: z.string().describe("username"),
  }),
  outputSchema: z.object({
    taskCount: z.number().optional(),
    tasks: z.string().optional(),
  }),
  execute: async ({ context }) => {
    if (!context) {
      throw new Error("Input data not found");
    }
    return await listReminders(context);
  },
});
const taskAssigned = createStep({
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
    if (!context) {
      throw new Error("Input data not found");
    }
    return await assignedTask(context);
  },
});
const completeTask = createStep({
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
    if (!context) {
      throw new Error("Input data not found");
    }
    return await markTaskComplete(context);
  },
});

// Create Task workflow
export const createTaskWorkflow = createWorkflow({
  id: "create-task-workflow",
  inputSchema: z.object({
    assignedBy: z.string(),
    assignedTo: z.string(),
    task: z.string(),
    dueDate: z.string(),
    priority: z.enum(["low", "medium", "high"]),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    taskId: z.string().optional(),
  }),
})
  .then(reminder)
  .commit();

// Get User Tasks workflow
export const getUserTasksWorkflow = createWorkflow({
  id: "get-user-tasks-workflow",
  inputSchema: z.object({
    user: z.string().describe("username"),
  }),
  outputSchema: z.object({
    taskCount: z.number().optional(),
    tasks: z.string().optional(),
  }),
})
  .then(getTask)
  .commit();

// Get Assigned Tasks workflow
export const getAssignedTasksWorkflow = createWorkflow({
  id: "get-assigned-tasks-workflow",
  inputSchema: z.object({
    assignedBy: z.string().describe("Username of who assigned the tasks"),
  }),
  outputSchema: z.object({
    totalTasks: z.number(),
    completedTasks: z.number(),
    notCompletedTasks: z.number(),
    overview: z.string(),
  }),
})
  .then(taskAssigned)
  .commit();

// Complete Task workflow
export const completeTaskWorkflow = createWorkflow({
  id: "complete-task-workflow",
  inputSchema: z.object({
    user: z.string().describe("Username"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
})
  .then(completeTask)
  .commit();


