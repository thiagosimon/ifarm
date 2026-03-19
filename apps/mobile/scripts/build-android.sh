#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

# ── Defaults ──────────────────────────────────────────────────────────────────
BUILD_FORMAT="${BUILD_FORMAT:-appbundle}"   # appbundle | apk
BUILD_NUMBER="${BUILD_NUMBER:-}"
BUILD_NAME="${BUILD_NAME:-}"
OBFUSCATE="${OBFUSCATE:-true}"
SPLIT_DEBUG="${SPLIT_DEBUG:-true}"
FLAVOR="${FLAVOR:-}"

# ── Parse args ────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --apk)         BUILD_FORMAT="apk"; shift ;;
    --appbundle)   BUILD_FORMAT="appbundle"; shift ;;
    --build-number)  BUILD_NUMBER="$2"; shift 2 ;;
    --build-name)    BUILD_NAME="$2"; shift 2 ;;
    --no-obfuscate)  OBFUSCATE="false"; shift ;;
    --flavor)        FLAVOR="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Pre-flight ────────────────────────────────────────────────────────────────
echo "🤖 iFarm Android Release Build"
echo "   Format      : $BUILD_FORMAT"
echo "   Project     : $PROJECT_DIR"
echo ""

flutter pub get
flutter gen-l10n

# ── Build command ─────────────────────────────────────────────────────────────
CMD=(flutter build "$BUILD_FORMAT" --release)

if [[ -n "$BUILD_NUMBER" ]]; then
  CMD+=(--build-number "$BUILD_NUMBER")
fi

if [[ -n "$BUILD_NAME" ]]; then
  CMD+=(--build-name "$BUILD_NAME")
fi

if [[ -n "$FLAVOR" ]]; then
  CMD+=(--flavor "$FLAVOR")
fi

if [[ "$OBFUSCATE" == "true" ]]; then
  CMD+=(--obfuscate)
  if [[ "$SPLIT_DEBUG" == "true" ]]; then
    DEBUG_DIR="$PROJECT_DIR/build/debug-info"
    mkdir -p "$DEBUG_DIR"
    CMD+=(--split-debug-info="$DEBUG_DIR")
    echo "   Debug info  : $DEBUG_DIR"
  fi
fi

echo "   Command     : ${CMD[*]}"
echo ""

"${CMD[@]}"

# ── Output ────────────────────────────────────────────────────────────────────
echo ""
if [[ "$BUILD_FORMAT" == "appbundle" ]]; then
  ARTIFACT="$PROJECT_DIR/build/app/outputs/bundle/release/app-release.aab"
else
  ARTIFACT="$PROJECT_DIR/build/app/outputs/flutter-apk/app-release.apk"
fi

if [[ -f "$ARTIFACT" ]]; then
  SIZE=$(du -sh "$ARTIFACT" | cut -f1)
  echo "✅ Build succeeded!"
  echo "   Artifact : $ARTIFACT"
  echo "   Size     : $SIZE"
else
  echo "⚠️  Build finished but artifact not found at expected path."
  echo "   Check build/app/outputs/ for the generated file."
fi
