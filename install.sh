#!/bin/bash
# Likes Training Planner Skill Installer

set -e

SKILL_NAME="likes-training-planner"
SKILL_URL="https://github.com/chenwynn/likes-training-planner/releases/latest/download/likes-training-planner.skill"
OPENCLAW_SKILLS_DIR="/opt/homebrew/lib/node_modules/openclaw/skills"

echo "📦 Installing Likes Training Planner Skill..."

# Detect OpenClaw skills directory
if [ -d "/opt/homebrew/lib/node_modules/openclaw/skills" ]; then
    SKILLS_DIR="/opt/homebrew/lib/node_modules/openclaw/skills"
elif [ -d "/usr/local/lib/node_modules/openclaw/skills" ]; then
    SKILLS_DIR="/usr/local/lib/node_modules/openclaw/skills"
elif [ -d "$HOME/.openclaw/skills" ]; then
    SKILLS_DIR="$HOME/.openclaw/skills"
else
    echo "❌ Error: Could not find OpenClaw skills directory"
    echo "Please manually specify: ./install.sh /path/to/skills"
    exit 1
fi

# Allow override
if [ -n "$1" ]; then
    SKILLS_DIR="$1"
fi

echo "📁 Skills directory: $SKILLS_DIR"

# Create temp directory
TMP_DIR=$(mktemp -d)
cd "$TMP_DIR"

# Download skill
echo "⬇️  Downloading skill..."
if command -v curl &> /dev/null; then
    curl -fsSL -o "$SKILL_NAME.skill" "$SKILL_URL"
elif command -v wget &> /dev/null; then
    wget -q -O "$SKILL_NAME.skill" "$SKILL_URL"
else
    echo "❌ Error: curl or wget required"
    exit 1
fi

# Check if skill file was downloaded
if [ ! -f "$SKILL_NAME.skill" ]; then
    echo "❌ Error: Failed to download skill"
    exit 1
fi

echo "✅ Downloaded"

# Remove old version if exists
if [ -d "$SKILLS_DIR/$SKILL_NAME" ]; then
    echo "🔄 Removing old version..."
    rm -rf "$SKILLS_DIR/$SKILL_NAME"
fi

# Extract skill
echo "📂 Extracting..."
unzip -q "$SKILL_NAME.skill" -d "$SKILLS_DIR/"

# Cleanup
rm -rf "$TMP_DIR"

echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Restart OpenClaw or wait for next session"
echo "2. Get your Likes API Key from my.likes.com.cn"
echo "3. Start using: '帮我生成一个训练计划'"
echo ""
echo "📚 Documentation: https://github.com/chenwynn/likes-training-planner"
