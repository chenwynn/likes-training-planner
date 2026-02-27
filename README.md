# Likes Training Planner Skill 🏃

**All-in-one training plan solution for My Likes platform**

Fetch data → Analyze → Generate → Push. One skill does it all.

## ✨ Features

- 📊 **Data Fetching** - Automatically download your training history
- 📈 **Smart Analysis** - Analyze patterns: frequency, volume, intensity
- 🎯 **Plan Generation** - Create personalized training plans
- 📝 **Format Conversion** - Convert to Likes-compatible code format
- 🚀 **One-Click Push** - Push plans directly to your Likes calendar
- 🎨 **Skill Center UI** - Configure via OpenClaw Control UI

## 🚀 Quick Start

### Installation

```bash
curl -fsSL https://raw.githubusercontent.com/chenwynn/likes-training-planner/main/install.sh | bash
```

### Configuration

**Method 1: OpenClaw Skill Center (Recommended)**
1. Open http://127.0.0.1:18789 → **Skills**
2. Find **likes-training-planner** 🏃
3. Click **Configure**, enter your Likes API Key
4. Save

**Method 2: Command Line**
```bash
cd /opt/homebrew/lib/node_modules/openclaw/skills/likes-training-planner
node scripts/configure.cjs
```

Get your API Key: https://my.likes.com.cn → 设置 → API 文档

### Usage

Just ask OpenClaw:
> "分析我过去30天的运动数据"
> 
> "根据我的记录，生成下周的训练计划"
> 
> "帮我制定一个8周马拉松备赛计划"

## 📋 Complete Workflow

### 1. Fetch Data
```bash
node scripts/fetch_activities.cjs --days 30 --output data.json
```

### 2. Analyze
```bash
node scripts/analyze_data.cjs data.json
```

Output example:
```json
{
  "period": { "days": 30, "start": "2026-02-01", "end": "2026-03-01" },
  "summary": {
    "totalRuns": 45,
    "totalKm": 156.5,
    "avgDailyKm": 5.2,
    "frequency": 1.5
  },
  "characteristics": "高频次、中等距离、有氧基础",
  "recommendations": ["可以适当增加间歇训练", "周末尝试更长距离"]
}
```

### 3. Generate Plan
Create a JSON file with your plan:
```json
{
  "plans": [
    {
      "name": "40min@(HRR+1.0~2.0)",
      "title": "轻松有氧",
      "start": "2026-03-10",
      "weight": "q3",
      "type": "qingsong",
      "sports": 1
    }
  ]
}
```

### 4. Push to Calendar
```bash
node scripts/push_plans.cjs plan.json
```

## 📚 Scripts Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `fetch_activities.cjs` | Download training history | `--days 30 --output data.json` |
| `analyze_data.cjs` | Analyze patterns | `analyze_data.cjs data.json` |
| `push_plans.cjs` | Push to Likes calendar | `push_plans.cjs plan.json` |
| `configure.cjs` | Interactive setup | `configure.cjs` |
| `set-config.cjs` | Quick config | `set-config.cjs API_KEY` |

## 🔧 Training Code Format

Likes `name` field format:

```
# Simple task
duration@(type+range)
30min@(HRR+1.0~2.0)

# Interval group  
{task1;task2}xN
{5min@(HRR+3.0~4.0);1min@(rest)}x3

# Complete workout
10min@(HRR+1.0~2.0);{1000m@(VDOT+4.0~5.0);2min@(rest)}x4;10min@(HRR+1.0~2.0)
```

See [references/code-format.md](likes-training-planner/references/code-format.md) for complete guide.

## 📁 File Structure

```
likes-training-planner/
├── SKILL.md                    # Main documentation
├── references/
│   ├── api-docs.md            # API documentation
│   ├── code-format.md         # Code format reference
│   └── sport-examples.md      # Training examples
└── scripts/
    ├── fetch_activities.cjs   # ⭐ NEW: Download data
    ├── analyze_data.cjs       # ⭐ NEW: Analyze patterns
    ├── push_plans.cjs         # Push plans
    ├── configure.cjs          # Setup wizard
    └── set-config.cjs         # Quick config
```

## 🆕 Changelog

### v1.3 - Complete Solution
- ✅ Added `fetch_activities.cjs` - automatic data download
- ✅ Added `analyze_data.cjs` - smart training analysis
- ✅ One skill does everything: fetch → analyze → generate → push
- ✅ No separate MCP server needed

### v1.2 - Skill Center Integration
- ✅ OpenClaw Skill Center support
- ✅ Graphical configuration UI
- ✅ .cjs scripts for ES module compatibility

### v1.1 - Configuration Support
- ✅ Configuration wizard
- ✅ Multiple auth methods

### v1.0 - Initial Release
- ✅ Basic plan generation and push

## 📝 License

MIT

## 🔗 Links

- **Repository**: https://github.com/chenwynn/likes-training-planner
- **Releases**: https://github.com/chenwynn/likes-training-planner/releases
- **My Likes**: https://my.likes.com.cn
