# taskforge — Claude Instructions

## Project Overview

taskforge is a Node.js CLI task manager with a web dashboard. Tasks are persisted to a local `tasks.json` file.

## Tech Stack

- **Runtime**: Node.js (ES modules — `"type": "module"`)
- **Storage**: `tasks.json` (local file, JSON format)
- **CLI parsing**: Built-in `process.argv` — no third-party packages
- **Web server**: Express 5.2.1 (`src/server.js`) — serves dashboard on port 3000

## Code Style

- Use `async/await` for all asynchronous operations — no raw `.then()` chains
- Write clean, readable code — prefer clarity over cleverness
- Add JSDoc comments to every function, including param and return types
- Use descriptive variable and function names
- Keep functions small and focused on a single responsibility

## JSDoc Example

```js
/**
 * Adds a new task to the task list.
 * @param {string} title - The task description.
 * @param {string} [priority='medium'] - Task priority: 'low', 'medium', or 'high'.
 * @returns {Promise<Task>} The newly created task object.
 */
async function addTask(title, priority = 'medium') { ... }
```

## Data Format

Tasks are stored in `tasks.json` as an array of objects:

```json
[
  {
    "id": 1,
    "title": "Fix login bug",
    "priority": "high",
    "status": "pending",
    "createdAt": "2026-03-09T00:00:00.000Z",
    "notes": "Check auth token validation"
  }
]
```

## File Structure

```
taskforge/
├── CLAUDE.md
├── README.md
├── package.json
├── tasks.json          # auto-created on first run
├── docs/
│   └── dashboard-plan.md   # API design reference for the web dashboard
├── public/
│   └── index.html      # single-file web dashboard (no build step)
└── src/
    ├── index.js        # CLI entry point
    ├── server.js       # Express web server (dashboard API + static serving)
    ├── tasks.js        # task CRUD logic
    └── storage.js      # read/write tasks.json
```

## Key Conventions

- Always read the latest `tasks.json` before writes to avoid overwriting concurrent changes
- Task IDs are auto-incrementing integers: find the max existing ID and add 1
- IDs are never renumbered after deletion — gaps are acceptable
- Valid priorities: `low`, `medium`, `high` — default is `medium` if omitted
- Tasks without a `priority` field (legacy) are treated as `medium` everywhere
- Valid statuses: `pending`, `done`
- Dates stored as ISO 8601 strings
- `deleteTask` returns the deleted task so callers can print its title
- Tasks have an optional `notes` field (empty string by default); set via `taskforge note <id> <text>`
- ES module `__dirname` shim: `dirname(fileURLToPath(import.meta.url))` — use this pattern in any new server-side file that needs a path relative to the source file

## Web Dashboard

Start the server: `node src/server.js`
- Dashboard UI: `http://localhost:3000`
- API: `GET /api/tasks` → full task array; `GET /api/stats` → `{ total, done, pending }`
- Static files served from `public/` via `express.static`
- Route handlers use try/catch and return HTTP 500 with `{ error: message }` on failure
- Frontend uses `textContent` (not `innerHTML`) for all user data to prevent XSS
- CSS class values for priority/status are whitelisted before use (never concatenate raw API data into class names)

## Development Notes
- Always restart REPL after adding MCP servers, skills, or commands
- Commit before big Claude Code sessions (git safety net)
- Use /context to check token usage when session feels slow
