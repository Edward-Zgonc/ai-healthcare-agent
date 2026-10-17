#!/usr/bin/env bash
set -euo pipefail

# Run from the repository root.
cd "$(dirname "$0")/.."

echo "🔧 Configuring Git commit template..."
current_template="$(git config --local --get commit.template || true)"

if [[ "$current_template" != ".gitmessage" ]]; then
  git config --local commit.template .gitmessage
  echo "✅ Git commit template set to .gitmessage."
else
  echo "✅ Git commit template already configured."
fi

echo "🔧 Configuring VS Code as the Git editor..."
if command -v code >/dev/null 2>&1; then
  current_editor="$(git config --local --get core.editor || true)"
  if [[ "$current_editor" != "code --wait" ]]; then
    git config --local core.editor "code --wait"
    echo "✅ Local Git editor set to VS Code."
  else
    echo "✅ Local Git editor already configured."
  fi
else
  echo "⚠️ VS Code CLI ('code') not found. Skipping Git editor configuration."
  echo "   To use VS Code for Git commits, install the 'code' CLI and rerun this setup script."
fi

echo "🏁 Development setup complete."