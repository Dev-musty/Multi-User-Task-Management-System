import { Mastra } from "@mastra/core/mastra";
import { taskManagementSystem } from "./agents/taskManagementSystem";
import { LibSQLStore } from "@mastra/libsql";
import { initDB } from "../database/db";
import { completeTaskWorkflow, createTaskWorkflow, getAssignedTasksWorkflow, getUserTasksWorkflow } from "./workflows/taskManagementWorkflows";
await initDB();
export const mastra = new Mastra({
  workflows: {
    createTaskWorkflow,
    getUserTasksWorkflow,
    getAssignedTasksWorkflow,
    completeTaskWorkflow
  },
  agents: { taskManagementSystem },
  storage: new LibSQLStore({
    url: "file:./storage.db",
  }),
});
