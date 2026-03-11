#!/bin/bash
# PreToolUse: intercept Bash commands that delete files and ask for confirmation

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Check if the command contains a file deletion (rm)
if echo "$CMD" | grep -qE '\brm\b'; then
  FILE=$(echo "$CMD" | grep -oP '(?<=rm\s(-rf?\s|-f\s|-r\s)*)[\S]+' | tail -1)
  echo "⚠️ About to delete: ${FILE:-unknown file}" >&2
  cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",
    "permissionDecisionReason": "This command deletes files: $CMD"
  }
}
EOF
fi

exit 0
