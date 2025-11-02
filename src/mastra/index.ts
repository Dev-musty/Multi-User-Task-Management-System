import { Mastra } from "@mastra/core/mastra";
import { personalAgent } from "./agents/onbardingAgent";
import { LibSQLStore } from "@mastra/libsql";
import { initDB } from "../database/db";
await initDB();
export const mastra = new Mastra({
  agents: { personalAgent },
  storage : new LibSQLStore({
  url: "file:./storage.db",
})
});
