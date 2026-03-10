import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, '../tasks.json');

/**
 * Reads all tasks from tasks.json.
 * @returns {Promise<Task[]>} Array of task objects.
 */
export async function readTasks() {
  const raw = await readFile(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

/**
 * Writes the full task array to tasks.json.
 * @param {Task[]} tasks - The array of tasks to persist.
 * @returns {Promise<void>}
 */
export async function writeTasks(tasks) {
  await writeFile(DB_PATH, JSON.stringify(tasks, null, 2));
}
