# taskforge

A fast, minimal CLI task manager for developers.

## Features

- Add, list, complete, and delete tasks from the terminal
- Prioritize tasks with labels (low, medium, high)
- Filter tasks by status or priority
- Persistent local storage — no account required

## Installation

```bash
npm install -g taskforge
```

## Usage

```bash
# Add a task
taskforge add "Fix login bug" --priority high

# List all tasks
taskforge list

# List by status
taskforge list --status pending
taskforge list --status done

# Complete a task
taskforge done <id>

# Delete a task
taskforge delete <id>

# Clear all completed tasks
taskforge clear
```

## Task Fields

| Field    | Description                        |
|----------|------------------------------------|
| id       | Auto-generated unique identifier   |
| title    | Task description                   |
| priority | low / medium / high (default: medium) |
| status   | pending / done                     |
| created  | Timestamp when task was created    |

## Storage

Tasks are stored locally in `~/.taskforge/tasks.json`.

## License

MIT
