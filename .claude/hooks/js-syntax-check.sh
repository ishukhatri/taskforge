#!/bin/bash
# PostToolUse: validate JS syntax after Write/Edit to a .js file

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check .js files
if [[ "$FILE" != *.js ]]; then
  exit 0
fi

if node --check "$FILE" 2>&1; then
  echo "✓ Syntax OK: $FILE"
else
  echo "✗ Syntax error in: $FILE" >&2
  exit 2
fi
