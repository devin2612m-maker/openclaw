---
name: morning-briefing
description: Generate personalized daily morning briefings with weather, news, tasks, and productivity recommendations. Trigger when user asks for "morning brief", "daily summary", "start my day", "what should I know today", or wants automated daily reports.
metadata: {"openclaw":{"emoji":"🌅","requires":{"bins":["curl","python3"]}}}
---

# Morning Briefing

Generate comprehensive daily briefings that include weather, trending content, tasks, and personalized recommendations.

## Quick start

Generate a morning briefing:
```bash
python3 {baseDir}/scripts/morning_briefing.py --location "Mumbai" --interests "tech,AI,startups"
```

With all options:
```bash
python3 {baseDir}/scripts/morning_briefing.py \
  --location "New Delhi" \
  --interests "tech,AI,crypto,business" \
  --tasks "Review PRs,Client meeting at 3pm,Submit report" \
  --format text
```

## Parameters

- `--location`: City name for weather (default: auto-detect via IP)
- `--interests`: Comma-separated topics for news/content (default: tech,business)
- `--tasks`: Comma-separated list of today's tasks (optional)
- `--format`: Output format - `text` (default) or `json`
- `--lang`: Language for output - `en` (default) or `hi` (Hindi/Hinglish)

## Briefing sections

1. **Weather** - Current conditions and forecast for the day
2. **Top News** - Headlines based on user interests
3. **Tasks** - Today's to-do items with priorities
4. **Recommendations** - Productivity tips based on weather and schedule
5. **Quote** - Motivational quote to start the day

## Scheduling daily briefings

To send automatic morning briefings, add a cron job in OpenClaw config:

```json
{
  "cron": {
    "jobs": [
      {
        "id": "morning-brief",
        "schedule": "0 8 * * *",
        "agent": "main",
        "channel": "telegram",
        "peer": "YOUR_TELEGRAM_ID",
        "message": "Generate my morning briefing"
      }
    ]
  }
}
```

## Integration with other skills

- Uses `weather` skill for weather data (wttr.in)
- Can integrate with `things-mac` or `trello` for task lists
- Works with `summarize` for news article summaries

## Example output

```
Good Morning! Here's your briefing for Friday, January 31, 2026

WEATHER - Mumbai
Currently: Partly Cloudy, 28°C
Today: High 32°C, Low 24°C, Humidity 65%
Tip: Good weather for outdoor activities!

TOP NEWS
1. OpenAI announces GPT-5 release date
2. India's tech sector grows 15% in Q4
3. New AI regulations proposed in EU

YOUR TASKS TODAY
- Review PRs (High priority)
- Client meeting at 3pm
- Submit report

RECOMMENDATIONS
- Start with deep work in the morning (cooler hours)
- Take breaks every 90 minutes
- Stay hydrated - warm weather expected

QUOTE OF THE DAY
"The only way to do great work is to love what you do." - Steve Jobs

Have a productive day!
```
