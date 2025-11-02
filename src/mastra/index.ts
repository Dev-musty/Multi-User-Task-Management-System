import { Mastra } from "@mastra/core/mastra";
import { taskManagementSystem } from "./agents/taskManagementSystem";
import { LibSQLStore } from "@mastra/libsql";
import { initDB } from "../database/db";
await initDB();
export const mastra = new Mastra({
  agents: { taskManagementSystem },
  storage : new LibSQLStore({
  url: "file:./storage.db",
})
});
