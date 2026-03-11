import { readTasks, writeTasks } from './storage.js';

const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * @typedef {Object} Task
 * @property {number} id - Auto-incrementing integer identifier.
 * @property {string} title - Task description.
 * @property {'low'|'medium'|'high'} priority - Task priority.
 * @property {'pending'|'done'} status - Current status.
 * @property {string} createdAt - ISO 8601 creation timestamp.
 */

/**
 * Adds a new task with the given title and priority.
 * @param {string} title - The task description.
 * @param {'low'|'medium'|'high'} [priority='medium'] - Task priority.
 * @returns {Promise<Task>} The newly created task.
 * @throws {Error} If priority is not a valid value.
 */
export async function addTask(title, priority = 'medium') {
  if (!VALID_PRIORITIES.includes(priority)) {
    throw new Error(`Invalid priority "${priority}". Use: low, medium, high`);
  }
  const tasks = await readTasks();
  const maxId = tasks.reduce((max, t) => Math.max(max, t.id), 0);
  const task = {
    id: maxId + 1,
    title,
    priority,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  await writeTasks(tasks);
  return task;
}

/**
 * Returns all tasks, optionally filtered by status and/or priority.
 * @param {'pending'|'done'|undefined} status - Filter by status, or omit for all.
 * @param {'low'|'medium'|'high'|undefined} priority - Filter by priority, or omit for all.
 * @returns {Promise<Task[]>} Array of matching tasks.
 */
export async function listTasks(status, priority) {
  let tasks = await readTasks();
  if (status) tasks = tasks.filter((t) => t.status === status);
  if (priority) tasks = tasks.filter((t) => (t.priority ?? 'medium') === priority);
  return tasks;
}

/**
 * Searches tasks by title (case-insensitive substring match).
 * @param {string} query - The search string to match against task titles.
 * @returns {Promise<Task[]>} Array of matching tasks.
 */
export async function searchTasks(query) {
  const tasks = await readTasks();
  const lower = query.toLowerCase();
  return tasks.filter((t) => t.title.toLowerCase().includes(lower));
}

/**
 * Marks a task as done by its ID.
 * @param {number} id - The task ID to complete.
 * @returns {Promise<Task>} The updated task.
 * @throws {Error} If no task with the given ID exists.
 */
export async function completeTask(id) {
  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === Number(id));
  if (!task) throw new Error(`Task not found: ${id}`);
  task.status = 'done';
  await writeTasks(tasks);
  return task;
}

/**
 * Clears all tasks by writing an empty array to storage.
 * @returns {Promise<void>}
 */
export async function clearTasks() {
  await writeTasks([]);
}

/**
 * Deletes a task by its ID.
 * @param {number} id - The task ID to delete.
 * @returns {Promise<Task>} The deleted task.
 * @throws {Error} If no task with the given ID exists.
 */
export async function deleteTask(id) {
  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === Number(id));
  if (index === -1) throw new Error(`Task not found: ${id}`);
  const [deleted] = tasks.splice(index, 1);
  await writeTasks(tasks);
  return deleted;
}
