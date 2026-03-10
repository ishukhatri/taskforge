#!/usr/bin/env node
import { addTask, listTasks, completeTask, deleteTask, clearTasks } from './tasks.js';

const VALID_PRIORITIES = ['low', 'medium', 'high'];

const USAGE = `
Usage:
  taskforge add <title> [priority]      Add a new task (priority: low, medium, high)
  taskforge list [--done] [priority]    List tasks, optionally filtered by priority
  taskforge done <id>                   Mark a task as done
  taskforge delete <id>                 Delete a task
  taskforge clear                       Remove all tasks
`.trim();

/**
 * Prints a task to stdout in a readable format.
 * @param {import('./tasks.js').Task} task - The task to display.
 */
function printTask(task) {
  const status = task.status === 'done' ? '[x]' : '[ ]';
  const pri = task.priority ?? 'medium';
  const date = new Date(task.createdAt).toLocaleDateString();
  console.log(`${status} ${task.id}  ${task.title}  [${pri}]  (${date})`);
}

/**
 * Main CLI entry point. Parses process.argv and dispatches commands.
 * @returns {Promise<void>}
 */
async function main() {
  const [, , command, ...args] = process.argv;

  if (!command) {
    console.log(USAGE);
    process.exit(0);
  }

  switch (command) {
    case 'add': {
      const lastArg = args[args.length - 1];
      const hasPriority = VALID_PRIORITIES.includes(lastArg);
      const title = hasPriority ? args.slice(0, -1).join(' ') : args.join(' ');
      const priority = hasPriority ? lastArg : 'medium';
      if (!title) {
        console.error('Error: please provide a task title.');
        process.exit(1);
      }
      const task = await addTask(title, priority);
      console.log(`Added: ${task.id}  "${task.title}"  [${task.priority}]`);
      break;
    }

    case 'list': {
      const filterDone = args.includes('--done');
      const status = filterDone ? 'done' : undefined;
      const priorityArg = args.find((a) => VALID_PRIORITIES.includes(a));
      const tasks = await listTasks(status, priorityArg);
      if (tasks.length === 0) {
        console.log('No tasks found.');
      } else {
        tasks.forEach(printTask);
      }
      break;
    }

    case 'done': {
      const id = args[0];
      if (!id) {
        console.error('Error: please provide a task ID.');
        process.exit(1);
      }
      const task = await completeTask(id);
      console.log(`Completed: "${task.title}"`);
      break;
    }

    case 'delete': {
      const id = args[0];
      if (!id) {
        console.error('Error: please provide a task ID.');
        process.exit(1);
      }
      const deleted = await deleteTask(id);
      console.log(`Deleted: "${deleted.title}"`);
      break;
    }

    case 'clear': {
      await clearTasks();
      console.log('All tasks cleared.');
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      console.log(USAGE);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
