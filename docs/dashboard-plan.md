# Dashboard API Design

## Task Data Shape

```json
{
  "id": 1,
  "title": "Fix login bug",
  "priority": "high",
  "status": "pending",
  "createdAt": "2026-03-09T00:00:00.000Z",
  "notes": "Check auth token validation"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `id` | number | Auto-incrementing, never renumbered |
| `title` | string | Task description |
| `priority` | `'low'` \| `'medium'` \| `'high'` | Defaults to `'medium'` |
| `status` | `'pending'` \| `'done'` | |
| `createdAt` | string | ISO 8601 timestamp |
| `notes` | string | Optional; may be empty string |

---

## GET /api/tasks

Returns all tasks as a JSON array.

**Response:** `Task[]`

Implementation: call `readTasks()` from `src/storage.js`.

---

## GET /api/stats

Returns aggregate task counts.

**Response:**
```json
{ "total": 10, "done": 3, "pending": 7 }
```

Implementation: call `readTasks()`, derive counts.

---

## Static Files

Serve `public/` via `express.static`. Root `/` should resolve to `public/index.html`.

---

## Technical Notes

- **ES modules**: `"type": "module"` — use `import`/`export`, shim `__dirname` via `fileURLToPath`
- **Express**: 5.2.1 already installed
- **Storage**: reuse `readTasks()` from `src/storage.js` — do not duplicate file I/O
- **Port**: 3000
- **Error handling**: wrap route handlers in try/catch, return HTTP 500 with `{ error: message }`
