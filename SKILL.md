---
name: likes-training-planner
description: Generate training plans in Likes system format and push to Likes calendar via API. Use when user needs to create structured training schedules (running, cycling, swimming, strength) that can be pushed to the My Likes platform. Handles plan generation, code formatting (name field), API authentication, and batch push operations.
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

Generate training plans compatible with My Likes platform and push them to user's calendar.

## Quick Start

### 1. Configure API Key

**Option A: OpenClaw Skill Center (Recommended)**
- Open OpenClaw Control UI → Skills
- Find "likes-training-planner"
- Enter your Likes API Key in the form

**Option B: Command Line**
```bash
cd /opt/homebrew/lib/node_modules/openclaw/skills/likes-training-planner
node scripts/configure.cjs
```

**Option C: Environment Variable**
```bash
export LIKES_API_KEY=your-api-key
```

Get your API Key from: https://my.likes.com.cn → 设置 → API 文档

### 2. Generate a Training Plan

Ask the user for:
- Goal (marathon prep, fat loss, base building, etc.)
- Duration (weeks)
- Weekly frequency (3-5 days)
- Available days (Mon, Wed, Fri, etc.)
- Current fitness level

### 3. Format for Likes API

Convert the plan to Likes-compatible JSON format. Each session needs:
- `name`: Training code following Likes format (see references/code-format.md)
- `title`: Display name (max 20 chars)
- `start`: Date in YYYY-MM-DD format
- `weight`: Intensity marker (q1/q2/q3/xuanxiu)
- `type`: Training type (qingsong, xiuxi, e, lsd, m, t, i, r, ft, com, ch, jili, max, drift, other)
- `sports`: 1=running, 2=cycling, 3=strength, 5=swimming, 254=other
- `description`: Optional notes

### 4. Push to Likes

Use the push script:
```bash
# If configured via Skill Center or configure.cjs
node scripts/push_plans.cjs plans.json

# Or with API key inline
node scripts/push_plans.cjs --key YOUR_KEY plans.json
```

## Configuration

### Option 1: Skill Center (Recommended)
OpenClaw Control UI → Skills → likes-training-planner → Configure

### Option 2: Configuration File

Run once:
```bash
node scripts/configure.cjs
```

Config stored at: `~/.openclaw/likes-training-planner.json`

### Option 3: Environment Variable

```bash
export LIKES_API_KEY=lt_xxxxxxxxxxxx
node scripts/push_plans.cjs plans.json
```

### Option 4: Command Line

```bash
node scripts/push_plans.cjs --key lt_xxxxxxxxxxxx plans.json
```

Priority: CLI `--key` > Environment variable > Config file > Skill Center

## Training Code Format (name field)

Format: `task1;task2;...`

**Basic task**: `duration@(type+range)`
- Examples: `30min@(HRR+1.0~2.0)`, `5km@(PACE+5'00~4'30)`

**Interval group**: `{task1;task2}xN`
- Example: `{5min@(HRR+3.0~4.0);1min@(rest)}x3`

**Rest**: `duration@(rest)` (parentheses required)
- Example: `2min@(rest)`

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

## Example Plan Generation

**Input**: "I need a 4-week base building plan, 4 days/week, easy pace"

**Output** (JSON for API):
```json
{
  "plans": [
    {
      "name": "40min@(HRR+1.0~2.0)",
      "title": "轻松有氧跑",
      "start": "2026-03-01",
      "weight": "q3",
      "type": "qingsong",
      "sports": 1,
      "description": "Week 1 - Day 1: 基础有氧"
    }
  ]
}
```

## References

- **Code format details**: See [references/code-format.md](references/code-format.md)
- **Sport-specific examples**: See [references/sport-examples.md](references/sport-examples.md)
- **API documentation**: See [references/api-docs.md](references/api-docs.md)

## Scripts

- `scripts/configure.cjs` - Configure API key and settings (interactive)
- `scripts/set-config.cjs` - Quick config setter (command line)
- `scripts/push_plans.cjs` - Push plans to Likes API
- `scripts/push_plans.sh` - Shell wrapper

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/chenwynn/likes-training-planner/main/install.sh | bash
```
