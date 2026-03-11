#!/bin/bash
# Stop: report changed files when Claude finishes a task

echo "✅ Task complete. Files changed:"
git -C "$(dirname "$0")/../.." diff --name-only
