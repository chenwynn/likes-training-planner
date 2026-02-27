---
name: likes-training-planner
description: Complete training plan solution for My Likes platform. Fetches historical data, analyzes training patterns, generates personalized plans, converts to Likes format, and pushes to calendar. All-in-one skill for running, cycling, swimming, and strength training.
homepage: https://github.com/chenwynn/likes-training-planner
metadata:
  {
    "openclaw":
      {
        "emoji": "🏃",
        "requires": { "env": ["LIKES_API_KEY"] },
        "primaryEnv": "LIKES_API_KEY",
      },
  }
---

# Likes Training Planner

Complete training plan solution for My Likes platform. **One skill does it all**: fetch data → analyze → generate → preview → confirm → push.

## Quick Start

### 1. Configure API Key

**OpenClaw Skill Center (Recommended):**
1. Open http://127.0.0.1:18789 → Skills
2. Find "likes-training-planner" 🏃
3. Click Configure, enter your Likes API Key
4. Save

Get API Key: https://my.likes.com.cn → 设置 → API 文档

### 2. Use the Skill

Just ask:
> "分析我过去30天的运动数据"
> 
> "根据我的记录，生成下周的训练计划"
> 
> "帮我制定一个8周马拉松备赛计划"

## Complete Workflow

### Step 1: Fetch Data

```bash
# Fetch last 30 days
node scripts/fetch_activities.cjs --days 30 --output data.json

# Or specific date range
node scripts/fetch_activities.cjs --start 2026-02-01 --end 2026-02-28 --output data.json
```

### Step 2: Analyze

```bash
node scripts/analyze_data.cjs data.json
```

Output includes:
- Total runs, distance, time
- Average pace, frequency
- Training characteristics
- Personalized recommendations

### Step 3: Generate Plan

Based on analysis, create a plan:
```json
{
  "plans": [
    {
      "name": "40min@(HRR+1.0~2.0)",
      "title": "轻松有氧跑",
      "start": "2026-03-10",
      "weight": "q3",
      "type": "qingsong",
      "sports": 1,
      "description": "根据近期数据，保持有氧基础"
    }
  ]
}
```

### Step 4: Preview and Confirm ⭐

**Always review before pushing!**

```bash
node scripts/preview_plan.cjs plans.json
```

This displays:
- 📅 Day-by-day training schedule
- 📊 Weekly summary
- 🏃 Type distribution
- ⚡ Intensity breakdown

Then asks for confirmation:
- `[Y]` Confirm and proceed to push
- `[N]` Cancel
- `[E]` Edit the plan file first

### Step 5: Push to Calendar

After confirmation:

```bash
node scripts/push_plans.cjs plans.json
```

**Complete workflow with preview:**
```bash
# 1. Fetch & analyze
node scripts/fetch_activities.cjs --days 30 --output data.json
node scripts/analyze_data.cjs data.json

# 2. (Create plan.json based on analysis)

# 3. Preview & confirm
node scripts/preview_plan.cjs plan.json

# 4. Push if confirmed
node scripts/push_plans.cjs plan.json
```

## Review Workflow for Users

When generating plans for users, **always follow this process**:

### 1. Generate Plan
Create the plan based on user's goals and historical data.

### 2. Preview
Show the plan using `preview_plan.cjs` or format it nicely:

```
📋 训练计划预览 - 第1周
════════════════════════════════════════════════════════════

1. 2026-03-10 周一
   📌 轻松有氧3公里
   📝 3km@(PACE+10'00~9'00)
   🏃 类型: 轻松跑
   ⚡ 强度: 🟢 低强度
   💭 周一起步，按习惯配速轻松完成

2. 2026-03-11 周二
   📌 走跑交替
   📝 【3min@(HRR+2.0~3.0);2min@(HRR+1.0~2.0)】×4组
   ...

📊 计划摘要
════════════════════════════════════════════════════════════
总训练日: 7 天
按类型: 轻松跑: 3 次, 间歇训练: 1 次, 长距离: 1 次
按强度: 🟢 低强度: 5 次, 🟠 中强度: 2 次
```

### 3. Ask for Confirmation
Present the plan to user and ask:

> "以上是为您生成的下周训练计划，请审核：
> 
> - 周一、周二、周三...（简述内容）
> - 总里程约 XX 公里
> - 包含 X 次高强度训练
>
> 是否需要调整？
> - ✅ 确认无误，推送到日历
> - ✏️ 需要修改（告诉我改哪里）
> - ❌ 取消"

### 4. Handle Feedback

**If user wants changes:**
- Ask specifically what to change
- Modify the plan
- Show updated preview
- Repeat until confirmed

**Common change requests:**
- "周三太忙，改到周四" → Adjust date
- "间歇太累，换成轻松跑" → Change type from `i` to `qingsong`
- "周末想跑更长" → Increase duration in `name` field
- "强度太高" → Change `weight` from `q2` to `q3`

### 5. Push After Confirmation

Only push after explicit user confirmation:

```bash
node scripts/push_plans.cjs plans.json
```

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `fetch_activities.cjs` | Download training history from Likes API |
| `analyze_data.cjs` | Analyze patterns and generate insights |
| `preview_plan.cjs` | ⭐ Display plan for user review |
| `push_plans.cjs` | Push to Likes calendar |
| `configure.cjs` | Interactive configuration wizard |
| `set-config.cjs` | Quick config setter |

## Data Analysis Features

The skill automatically analyzes:
- **Frequency**: How often you train
- **Volume**: Total distance and time
- **Intensity**: Pace distribution and trends
- **Pattern**: Training characteristics (e.g., "high frequency, short distance, aerobic")
- **Recommendations**: Personalized suggestions

## Training Code Format (name field)

Format: `task1;task2;...`

**Basic task**: `duration@(type+range)`
- `30min@(HRR+1.0~2.0)` - 30 min easy run
- `5km@(PACE+5'00~4'30)` - 5km with pace target

**Interval group**: `{task1;task2}xN`
- `{5min@(HRR+3.0~4.0);1min@(rest)}x3` - 3 sets of 5min hard + 1min rest

**Rest**: `2min@(rest)` - 2 minutes rest

### Intensity Types

| Type | Description | Example |
|------|-------------|---------|
| HRR | Heart rate reserve % | `HRR+1.0~2.0` |
| VDOT | VDOT pace zone | `VDOT+4.0~5.0` |
| PACE | Absolute pace (min'sec) | `PACE+5'30~4'50` |
| t/ | Threshold pace % | `t/0.88~0.99` |
| MHR | Max heart rate % | `MHR+0.85~0.95` |
| LTHR | Lactate threshold HR % | `LTHR+1.0~1.05` |
| EFFORT | Perceived effort | `EFFORT+0.8~1.0` |
| FTP | Power % (cycling) | `FTP+0.75~0.85` |
| CP | Absolute power W | `CP+200~240` |
| CSS | Critical swim speed % | `CSS+0.95~1.05` |
| TSP | Threshold swim pace % | `TSP+0.95~1.05` |
| OPEN | Open-ended | `OPEN+1` |

### Duration Units
- `min` = minutes
- `s` = seconds
- `m` = meters
- `km` = kilometers
- `c` = count/reps

## Training Type Mapping

| Type Code | Description |
|-----------|-------------|
| qingsong | Easy run |
| xiuxi | Rest day |
| e | Aerobic training |
| lsd | Long slow distance |
| m | Marathon pace |
| t | Threshold/lactate training |
| i | Interval training |
| r | Speed/repetition |
| ft | Fartlek |
| com | Combined workout |
| ch | Variable pace |
| jili | Strength training |
| max | Max HR test |
| drift | Aerobic stability test |
| other | Other |

## Intensity Weights

| Weight | Color | Description |
|--------|-------|-------------|
| q1 | Red | High intensity |
| q2 | Orange | Medium intensity |
| q3 | Green | Low intensity |
| xuanxiu | Blue | Optional/recovery |

## Example Usage

### Analyze and Generate in One Go

```bash
# Fetch and analyze
cd /opt/homebrew/lib/node_modules/openclaw/skills/likes-training-planner
node scripts/fetch_activities.cjs --days 14 | node scripts/analyze_data.cjs
```

### Create Weekly Plan with Review

```bash
# 1. Fetch data
node scripts/fetch_activities.cjs --days 14 --output data.json

# 2. Analyze
node scripts/analyze_data.cjs data.json

# 3. Create plan (week_plan.json)
# ... edit file ...

# 4. Preview
node scripts/preview_plan.cjs week_plan.json

# 5. Push after confirmation
node scripts/push_plans.cjs week_plan.json
```

## Configuration

### Priority (highest to lowest):
1. Command line `--key`
2. Environment variable `LIKES_API_KEY`
3. Config file `~/.openclaw/likes-training-planner.json`
4. OpenClaw Skill Center config

## References

- **Code format**: [references/code-format.md](references/code-format.md)
- **Sport examples**: [references/sport-examples.md](references/sport-examples.md)
- **API docs**: [references/api-docs.md](references/api-docs.md)

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/chenwynn/likes-training-planner/main/install.sh | bash
```
