#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

echo "🧹 iFarm Clean"
echo ""

flutter clean
rm -rf "$PROJECT_DIR/build/"

if [[ -d "$PROJECT_DIR/ios/Pods" ]]; then
  echo "   Removing iOS Pods..."
  rm -rf "$PROJECT_DIR/ios/Pods"
  rm -f "$PROJECT_DIR/ios/Podfile.lock"
fi

echo ""
echo "✅ Clean complete. Run 'flutter pub get' to restore dependencies."
