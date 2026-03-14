#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Load secrets if available
if [ -f "$SCRIPT_DIR/deploy/secrets.sh" ]; then
  source "$SCRIPT_DIR/deploy/secrets.sh"
fi

echo "Pushing to origin..."
git push

echo ""
echo "Deploying to production..."
cd "$SCRIPT_DIR/deploy"
ansible-playbook -i inventory.ini playbook.yml

echo ""
echo "Done! Push and deploy complete."
