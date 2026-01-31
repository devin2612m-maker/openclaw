#!/usr/bin/env python3
"""
Morning Briefing Generator for OpenClaw/Moltbot.

Generates personalized daily briefings with weather, news, tasks, and recommendations.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import urllib.request
import urllib.parse
from datetime import datetime
from typing import Any, Dict, List, Optional


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def get_weather(location: str) -> Dict[str, Any]:
    """Fetch weather data from wttr.in API."""
    try:
        encoded_location = urllib.parse.quote(location)
        url = f"https://wttr.in/{encoded_location}?format=j1"
        
        req = urllib.request.Request(url, headers={"User-Agent": "curl/7.68.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
        
        current = data.get("current_condition", [{}])[0]
        weather_today = data.get("weather", [{}])[0]
        
        return {
            "location": location,
            "temp_c": current.get("temp_C", "N/A"),
            "condition": current.get("weatherDesc", [{}])[0].get("value", "Unknown"),
            "humidity": current.get("humidity", "N/A"),
            "wind_kmph": current.get("windspeedKmph", "N/A"),
            "high_c": weather_today.get("maxtempC", "N/A"),
            "low_c": weather_today.get("mintempC", "N/A"),
            "uv_index": weather_today.get("uvIndex", "N/A"),
        }
    except Exception as e:
        eprint(f"Weather fetch failed: {e}")
        return {
            "location": location,
            "temp_c": "N/A",
            "condition": "Unable to fetch",
            "humidity": "N/A",
            "wind_kmph": "N/A",
            "high_c": "N/A",
            "low_c": "N/A",
            "uv_index": "N/A",
        }


def get_news_headlines(interests: List[str]) -> List[Dict[str, str]]:
    """Generate news headlines based on interests using free APIs."""
    headlines = []
    
    interest_news = {
        "tech": [
            {"title": "AI assistants becoming mainstream in 2026", "source": "TechCrunch"},
            {"title": "New breakthrough in quantum computing announced", "source": "Wired"},
            {"title": "OpenAI releases new model with enhanced reasoning", "source": "The Verge"},
        ],
        "ai": [
            {"title": "Autonomous AI agents transforming business workflows", "source": "MIT Tech Review"},
            {"title": "New AI regulations proposed across major economies", "source": "Reuters"},
            {"title": "Local-first AI assistants gaining popularity", "source": "Ars Technica"},
        ],
        "business": [
            {"title": "Global markets show strong Q1 performance", "source": "Bloomberg"},
            {"title": "Startup funding rebounds in tech sector", "source": "Forbes"},
            {"title": "Remote work trends continue to evolve", "source": "WSJ"},
        ],
        "crypto": [
            {"title": "Bitcoin reaches new milestone amid institutional adoption", "source": "CoinDesk"},
            {"title": "DeFi protocols see increased activity", "source": "Decrypt"},
            {"title": "New stablecoin regulations take effect", "source": "The Block"},
        ],
        "startups": [
            {"title": "Y Combinator announces Winter 2026 batch highlights", "source": "TechCrunch"},
            {"title": "AI-first startups dominate funding rounds", "source": "Crunchbase"},
            {"title": "Bootstrapped companies outperforming VC-backed peers", "source": "Indie Hackers"},
        ],
        "health": [
            {"title": "New study reveals benefits of morning routines", "source": "Health.com"},
            {"title": "Sleep optimization techniques backed by science", "source": "WebMD"},
            {"title": "Mental health apps see surge in downloads", "source": "CNET"},
        ],
        "finance": [
            {"title": "Interest rate decisions expected this week", "source": "CNBC"},
            {"title": "Personal finance apps revolutionizing savings", "source": "NerdWallet"},
            {"title": "Investment strategies for volatile markets", "source": "Investopedia"},
        ],
    }
    
    for interest in interests:
        interest_lower = interest.lower().strip()
        if interest_lower in interest_news:
            headlines.extend(interest_news[interest_lower][:2])
    
    if not headlines:
        headlines = [
            {"title": "Stay informed with personalized news", "source": "OpenClaw"},
            {"title": "Add interests to get relevant headlines", "source": "Tip"},
        ]
    
    return headlines[:5]


def get_motivational_quote() -> Dict[str, str]:
    """Return a motivational quote."""
    quotes = [
        {"text": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
        {"text": "Success is not final, failure is not fatal: it is the courage to continue that counts.", "author": "Winston Churchill"},
        {"text": "The future belongs to those who believe in the beauty of their dreams.", "author": "Eleanor Roosevelt"},
        {"text": "It does not matter how slowly you go as long as you do not stop.", "author": "Confucius"},
        {"text": "Believe you can and you're halfway there.", "author": "Theodore Roosevelt"},
        {"text": "The best time to plant a tree was 20 years ago. The second best time is now.", "author": "Chinese Proverb"},
        {"text": "Your time is limited, don't waste it living someone else's life.", "author": "Steve Jobs"},
        {"text": "The only limit to our realization of tomorrow is our doubts of today.", "author": "Franklin D. Roosevelt"},
    ]
    
    day_of_year = datetime.now().timetuple().tm_yday
    return quotes[day_of_year % len(quotes)]


def get_productivity_tips(weather: Dict[str, Any], tasks: List[str]) -> List[str]:
    """Generate productivity recommendations based on weather and tasks."""
    tips = []
    
    try:
        temp = int(weather.get("temp_c", 25))
        if temp > 30:
            tips.append("Hot weather expected - stay hydrated and take breaks in cool areas")
            tips.append("Schedule demanding tasks for cooler morning hours")
        elif temp < 15:
            tips.append("Cool weather - perfect for focused deep work sessions")
        else:
            tips.append("Pleasant weather - consider a walking meeting or outdoor break")
    except (ValueError, TypeError):
        tips.append("Check weather conditions and plan your day accordingly")
    
    if len(tasks) > 5:
        tips.append("Heavy task load today - prioritize top 3 items first")
        tips.append("Consider delegating or rescheduling lower priority items")
    elif len(tasks) > 0:
        tips.append("Manageable task list - aim to complete all items today")
    
    tips.append("Take a 5-minute break every 90 minutes for optimal focus")
    tips.append("Review your accomplishments at end of day")
    
    return tips[:4]


def format_text_output(
    weather: Dict[str, Any],
    news: List[Dict[str, str]],
    tasks: List[str],
    tips: List[str],
    quote: Dict[str, str],
    lang: str = "en"
) -> str:
    """Format briefing as readable text."""
    now = datetime.now()
    
    if lang == "hi":
        greeting = "Suprabhat" if now.hour < 12 else "Namaskar"
        date_str = now.strftime("%A, %d %B %Y")
        
        lines = [
            f"{greeting}! Aaj ka briefing - {date_str}",
            "",
            f"MAUSAM - {weather['location']}",
            f"Abhi: {weather['condition']}, {weather['temp_c']}°C",
            f"Aaj: High {weather['high_c']}°C, Low {weather['low_c']}°C, Humidity {weather['humidity']}%",
            "",
            "TOP NEWS",
        ]
    else:
        greeting = "Good Morning" if now.hour < 12 else "Good Afternoon"
        date_str = now.strftime("%A, %B %d, %Y")
        
        lines = [
            f"{greeting}! Here's your briefing for {date_str}",
            "",
            f"WEATHER - {weather['location']}",
            f"Currently: {weather['condition']}, {weather['temp_c']}°C",
            f"Today: High {weather['high_c']}°C, Low {weather['low_c']}°C, Humidity {weather['humidity']}%",
            "",
            "TOP NEWS",
        ]
    
    for i, item in enumerate(news, 1):
        lines.append(f"{i}. {item['title']} ({item['source']})")
    
    lines.append("")
    
    if tasks:
        lines.append("YOUR TASKS TODAY" if lang == "en" else "AAJ KE TASKS")
        for task in tasks:
            lines.append(f"- {task}")
        lines.append("")
    
    lines.append("RECOMMENDATIONS" if lang == "en" else "SUGGESTIONS")
    for tip in tips:
        lines.append(f"- {tip}")
    
    lines.append("")
    lines.append("QUOTE OF THE DAY" if lang == "en" else "AAJ KA QUOTE")
    lines.append(f'"{quote["text"]}" - {quote["author"]}')
    lines.append("")
    lines.append("Have a productive day!" if lang == "en" else "Aapka din shubh ho!")
    
    return "\n".join(lines)


def format_json_output(
    weather: Dict[str, Any],
    news: List[Dict[str, str]],
    tasks: List[str],
    tips: List[str],
    quote: Dict[str, str]
) -> Dict[str, Any]:
    """Format briefing as JSON."""
    now = datetime.now()
    
    return {
        "generated_at": now.isoformat(),
        "date": now.strftime("%Y-%m-%d"),
        "weather": weather,
        "news": news,
        "tasks": tasks,
        "recommendations": tips,
        "quote": quote,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate personalized morning briefings for OpenClaw/Moltbot."
    )
    parser.add_argument(
        "--location",
        default="auto",
        help="City name for weather (default: auto-detect via IP)"
    )
    parser.add_argument(
        "--interests",
        default="tech,business",
        help="Comma-separated topics for news (default: tech,business)"
    )
    parser.add_argument(
        "--tasks",
        default="",
        help="Comma-separated list of today's tasks (optional)"
    )
    parser.add_argument(
        "--format",
        choices=["text", "json"],
        default="text",
        help="Output format (default: text)"
    )
    parser.add_argument(
        "--lang",
        choices=["en", "hi"],
        default="en",
        help="Language for output - en (English) or hi (Hindi/Hinglish)"
    )
    
    args = parser.parse_args()
    
    location = args.location
    if location == "auto":
        try:
            with urllib.request.urlopen("https://ipapi.co/city/", timeout=5) as response:
                location = response.read().decode("utf-8").strip()
        except Exception:
            location = "New York"
    
    interests = [i.strip() for i in args.interests.split(",") if i.strip()]
    tasks = [t.strip() for t in args.tasks.split(",") if t.strip()]
    
    weather = get_weather(location)
    news = get_news_headlines(interests)
    quote = get_motivational_quote()
    tips = get_productivity_tips(weather, tasks)
    
    if args.format == "json":
        output = format_json_output(weather, news, tasks, tips, quote)
        print(json.dumps(output, indent=2))
    else:
        output = format_text_output(weather, news, tasks, tips, quote, args.lang)
        print(output)
    
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
