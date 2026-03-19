#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

# ── Defaults ──────────────────────────────────────────────────────────────────
BUILD_FORMAT="${BUILD_FORMAT:-ipa}"        # ipa | ios
BUILD_NUMBER="${BUILD_NUMBER:-}"
BUILD_NAME="${BUILD_NAME:-}"
OBFUSCATE="${OBFUSCATE:-true}"
SPLIT_DEBUG="${SPLIT_DEBUG:-true}"
NO_CODESIGN="${NO_CODESIGN:-false}"
EXPORT_OPTIONS="${EXPORT_OPTIONS:-}"
FLAVOR="${FLAVOR:-}"

# ── Parse args ────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --ipa)            BUILD_FORMAT="ipa"; shift ;;
    --ios)            BUILD_FORMAT="ios"; shift ;;
    --build-number)   BUILD_NUMBER="$2"; shift 2 ;;
    --build-name)     BUILD_NAME="$2"; shift 2 ;;
    --no-obfuscate)   OBFUSCATE="false"; shift ;;
    --no-codesign)    NO_CODESIGN="true"; shift ;;
    --export-options) EXPORT_OPTIONS="$2"; shift 2 ;;
    --flavor)         FLAVOR="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Pre-flight ────────────────────────────────────────────────────────────────
echo "🍎 iFarm iOS Release Build"
echo "   Format      : $BUILD_FORMAT"
echo "   Project     : $PROJECT_DIR"
echo ""

flutter pub get
flutter gen-l10n

# Install/update CocoaPods
if [[ -f "$PROJECT_DIR/ios/Podfile" ]]; then
  echo "   Installing CocoaPods..."
  (cd "$PROJECT_DIR/ios" && pod install --repo-update)
  echo ""
fi

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

if [[ "$NO_CODESIGN" == "true" ]]; then
  CMD+=(--no-codesign)
fi

if [[ -n "$EXPORT_OPTIONS" ]]; then
  CMD+=(--export-options-plist "$EXPORT_OPTIONS")
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
if [[ "$BUILD_FORMAT" == "ipa" ]]; then
  ARTIFACT_DIR="$PROJECT_DIR/build/ios/ipa"
  ARTIFACT=$(find "$ARTIFACT_DIR" -name "*.ipa" 2>/dev/null | head -1)
else
  ARTIFACT="$PROJECT_DIR/build/ios/iphoneos/Runner.app"
fi

if [[ -n "$ARTIFACT" && -e "$ARTIFACT" ]]; then
  if [[ -f "$ARTIFACT" ]]; then
    SIZE=$(du -sh "$ARTIFACT" | cut -f1)
  else
    SIZE=$(du -sh "$ARTIFACT" | cut -f1)
  fi
  echo "✅ Build succeeded!"
  echo "   Artifact : $ARTIFACT"
  echo "   Size     : $SIZE"
else
  echo "⚠️  Build finished but artifact not found at expected path."
  echo "   Check build/ios/ for the generated file."
fi
