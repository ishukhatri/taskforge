import express from 'express';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readTasks } from './storage.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.static(resolve(__dirname, '../public')));

/**
 * GET /api/tasks
 * Returns all tasks as a JSON array.
 * @returns {Promise<void>} Responds with Task[] or a 500 error object.
 */
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await readTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/stats
 * Returns aggregate task counts: total, done, and pending.
 * @returns {Promise<void>} Responds with { total, done, pending } or a 500 error object.
 */
app.get('/api/stats', async (req, res) => {
  try {
    let tasks;
    try {
      tasks = await readTasks();
    } catch (err) {
      if (err.code === 'ENOENT') {
        tasks = [];
      } else {
        throw err;
      }
    }

    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const pending = total - done;

    res.json({ total, done, pending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`);
});
