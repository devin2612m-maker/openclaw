---
summary: "Configure DeepSeek API for DeepSeek Chat (V3) and DeepSeek Reasoner (R1)"
read_when:
  - You want to use DeepSeek models directly via their API
  - You need DeepSeek Chat or DeepSeek Reasoner setup
  - You want copy/paste config for DeepSeek provider
---

# DeepSeek

DeepSeek provides an OpenAI-compatible API at `https://api.deepseek.com/v1`.
OpenClaw supports DeepSeek as a built-in provider when you set `DEEPSEEK_API_KEY`.

## Quick setup

```bash
export DEEPSEEK_API_KEY="sk-..."
openclaw models set deepseek/deepseek-chat
```

Or configure in `openclaw.json`:

```json5
{
  env: { DEEPSEEK_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "deepseek/deepseek-chat" }
    }
  }
}
```

## Available models

| Model ID | Name | Reasoning | Context | Description |
|----------|------|-----------|---------|-------------|
| `deepseek-chat` | DeepSeek Chat (V3) | No | 64k | General-purpose chat model |
| `deepseek-reasoner` | DeepSeek Reasoner (R1) | Yes | 64k | Reasoning model with chain-of-thought |

## Model references

- `deepseek/deepseek-chat` - DeepSeek V3, general-purpose chat
- `deepseek/deepseek-reasoner` - DeepSeek R1, reasoning model

## Pricing

DeepSeek pricing (per million tokens, USD):

| Model | Input | Output | Cache Read | Cache Write |
|-------|-------|--------|------------|-------------|
| deepseek-chat | $0.14 | $0.28 | $0.014 | $0.14 |
| deepseek-reasoner | $0.55 | $2.19 | $0.14 | $0.55 |

## Config snippet

```json5
{
  env: { DEEPSEEK_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "deepseek/deepseek-chat" },
      models: {
        "deepseek/deepseek-chat": { alias: "DeepSeek" },
        "deepseek/deepseek-reasoner": { alias: "DeepSeek R1" }
      }
    }
  }
}
```

## Notes

- DeepSeek uses an OpenAI-compatible API, so no special configuration is needed beyond the API key.
- The provider is auto-discovered when `DEEPSEEK_API_KEY` is set.
- For reasoning tasks, use `deepseek/deepseek-reasoner` which supports chain-of-thought.
- Get your API key at [platform.deepseek.com](https://platform.deepseek.com/).
