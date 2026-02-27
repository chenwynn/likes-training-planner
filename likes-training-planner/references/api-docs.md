# Likes Open API Documentation

API endpoint for pushing training plans to My Likes calendar.

## Endpoint

```
POST https://my.likes.com.cn/api/open/plans/push
```

## Authentication

Header: `X-API-Key: your-api-key`

## Request Format

```json
{
  "plans": [
    {
      "name": "10min@(HRR+1.0~2.0);{5min@(HRR+3.0~4.0);1min@(rest)}x3;5min@(HRR+1.0~2.0)",
      "title": "有氧间歇训练",
      "start": "2025-06-10",
      "weight": "q2",
      "type": "i",
      "description": "周二有氧间歇",
      "sports": 1,
      "game_id": 0
    }
  ]
}
```

## Field Reference

### Required Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `name` | string | Training code in Likes format | See code-format.md |
| `title` | string | Display title | Max 20 characters |
| `start` | string | Date | Format: YYYY-MM-DD |

### Optional Fields

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `weight` | string | Intensity marker | - |
| `type` | string | Training type | - |
| `description` | string | Notes/remarks | - |
| `sports` | integer | Sport type | 1 (running) |
| `game_id` | integer | Training camp ID | 0 |

## Field Enumerations

### weight (Intensity)

| Value | Color | Description |
|-------|-------|-------------|
| `q1` | Red | High intensity |
| `q2` | Orange | Medium intensity |
| `q3` | Green | Low intensity |
| `xuanxiu` | Blue | Optional/recovery |

### type (Training Type)

| Value | Description |
|-------|-------------|
| `qingsong` | Easy run |
| `xiuxi` | Rest day |
| `e` | Aerobic training |
| `lsd` | Long slow distance |
| `m` | Marathon pace |
| `t` | Threshold/lactate training |
| `i` | Interval training |
| `r` | Speed/repetition |
| `ft` | Fartlek |
| `com` | Combined workout |
| `ch` | Variable pace |
| `jili` | Strength training |
| `max` | Max HR test |
| `drift` | Aerobic stability test |
| `other` | Other |

### sports (Sport Type)

| Value | Sport |
|-------|-------|
| 1 | Running (default) |
| 2 | Cycling |
| 3 | Strength |
| 5 | Swimming |
| 254 | Other |

## Response Format

```json
{
  "total": 2,
  "parse_ok": 1,
  "parse_failed": 1,
  "inserted": 2,
  "insert_failed": 0,
  "results": [
    {
      "index": 0,
      "title": "有氧间歇训练",
      "start": "2025-06-10",
      "status": "ok",
      "message": ""
    },
    {
      "index": 1,
      "title": "测试计划",
      "start": "2025-06-11",
      "status": "parse_error",
      "message": "课表代码不能识别: \"xyz\""
    }
  ]
}
```

### Status Codes

| Status | Description | Data Saved? |
|--------|-------------|-------------|
| `ok` | Success | Yes |
| `parse_error` | Code parsing failed | Yes (content=[]) |
| `validate_error` | Field validation failed | No |
| `insert_error` | Database error | No |

## Limits

- Maximum 200 plans per request
- Rate limit: Check API documentation

## Error Handling

Common errors:
- `401`: Invalid API key
- `400`: Invalid JSON or missing required fields
- `429`: Rate limit exceeded
- `500`: Server error

## Testing

Test with curl:
```bash
curl -X POST https://my.likes.com.cn/api/open/plans/push \
  -H "X-API-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{
    "plans": [{
      "name": "30min@(HRR+1.0~2.0)",
      "title": "轻松跑",
      "start": "2025-06-10",
      "weight": "q3",
      "type": "qingsong",
      "sports": 1
    }]
  }'
```
