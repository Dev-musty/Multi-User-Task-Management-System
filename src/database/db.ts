import { join, dirname } from 'path'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url'

// Define the database schema
export interface Task {
  id: string;
  assignedTo: string;
  assignedBy: string;
  task: string;
  dueDate: string; // Store as ISO string
  reminder: string; // Store as ISO string
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export interface Database {
  tasks: Task[];
}

// Database file path
const currentDirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(currentDirname,'db.json')

// Create database instance
const adapter = new JSONFile<Database>(dbPath);
const defaultData: Database = { tasks: [] };
export const db = new Low<Database>(adapter, defaultData);

// Initialize database
export async function initDB() {
  await db.read();
  if(!db.data){
    db.data = defaultData;
  }
  await db.write();
}

// add tasks
export async function addTask(task: Task) {
  await db.read();
  db.data.tasks.push(task);
  await db.write();
}

// get a task by its Id
export async function getTaskById(id: string) {
  await db.read();
  return db.data.tasks.find(t => t.id === id);
}

//get a task assigned to a user (mainly for PMS)
export async function getUserTasks(username: string) {
  await db.read();
  return db.data.tasks.filter(t => t.assignedTo.toLowerCase() === username.toLowerCase());
}

//get who assigned the task
export async function getTasksByAssigner(username: string) {
  await db.read();
  return db.data.tasks.filter(t => t.assignedBy.toLowerCase() === username.toLowerCase());
}


export async function updateTask(id: string, updates: Partial<Task>) {
  await db.read();
  const task = db.data.tasks.find(t => t.id === id);
  if (task) {
    Object.assign(task, updates);
    await db.write();
    return task;
  }
  return null;
}

export async function completeTaskById(id: string) {
  return await updateTask(id, {
    completed: true,
    completedAt: new Date().toISOString(),
  });
}
