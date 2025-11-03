import { Mastra } from "@mastra/core/mastra";
import { taskManagementSystem } from "./agents/taskManagementSystem";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from '@mastra/loggers';
import { initDB } from "../database/db";
import { completeTaskWorkflow, createTaskWorkflow, getAssignedTasksWorkflow, getUserTasksWorkflow } from "./workflows/taskManagementWorkflows";
import { a2aAgentRoute } from "./routes/routes";
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
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'debug',
  }),
  observability: {
    default: { enabled: true },
  },
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true,
    },
    apiRoutes: [
      a2aAgentRoute
    ]
  }
});
