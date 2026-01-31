---
name: devin
description: "Delegate complex coding tasks to Devin AI - an autonomous software engineer that can build, debug, and deploy applications."
metadata: {"openclaw":{"emoji":"🤖","requires":{"env":["DEVIN_API_KEY"]}}}
---

# Devin AI Integration

Devin is an autonomous AI software engineer that can work on complex coding tasks independently. Use Devin for tasks that require:
- Building complete applications (frontend, backend, full-stack)
- Complex refactoring or migrations
- Multi-file changes across a codebase
- Tasks that take more than a few minutes

## When to Use Devin

**USE Devin for:**
- "Build a video automation system"
- "Create a REST API with authentication"
- "Refactor the entire auth module"
- "Build a React dashboard"
- "Set up CI/CD pipeline"
- Any task involving multiple files, complex logic, or deployment

**DON'T use Devin for:**
- Simple questions or explanations
- Quick one-line fixes
- Reading/summarizing files
- Tasks you can do in under 2 minutes

## Available Tools

### devin_create_session
Create a new Devin session to start a coding task.

```
devin_create_session prompt:"Build a FastAPI backend with user authentication and SQLite database"
```

**Parameters:**
- `prompt` (required): Detailed description of the task
- `playbook_id` (optional): Use a predefined playbook
- `idempotent` (optional): Reuse existing session with same prompt

**Returns:** Session ID and URL to monitor progress

### devin_send_message
Send follow-up instructions to an active Devin session.

```
devin_send_message session_id:"abc123" message:"Also add rate limiting to the API endpoints"
```

### devin_get_status
Check the status of a Devin session.

```
devin_get_status session_id:"abc123"
```

**Status values:**
- `running` - Devin is actively working
- `blocked` - Devin needs input or clarification
- `finished` - Task completed
- `failed` - Task failed (check session URL for details)

## Usage Pattern

1. **Create session** with detailed prompt
2. **Share the session URL** with user so they can monitor
3. **Check status** periodically if needed
4. **Send messages** if Devin needs clarification

## Example Workflow

User: "Build me a video editing automation system"

```
# Step 1: Create Devin session
devin_create_session prompt:"Build a video automation system with:
- FastAPI backend with FFmpeg for video processing
- React frontend for uploading videos and selecting templates
- Features: merge videos, add transitions, overlay text, replace audio
- Deploy to cloud with persistent storage"

# Response: Session created! URL: https://app.devin.ai/sessions/xyz789
# Share this URL with the user

# Step 2: Check status after some time
devin_get_status session_id:"xyz789"

# Step 3: If Devin needs more info
devin_send_message session_id:"xyz789" message:"Use AWS S3 for storage, here are the credentials..."
```

## Important Notes

1. **Always share the session URL** - User can watch Devin work in real-time
2. **Be specific in prompts** - More detail = better results
3. **Devin works autonomously** - It will create PRs, deploy apps, etc.
4. **Check status periodically** - Devin might need clarification
5. **Devin has its own environment** - It runs on Devin's cloud, not locally

## Automatic Delegation Rule

When a user asks for any of these, automatically use `devin_create_session`:
- Building an app/system/tool
- Creating APIs or backends
- Frontend development
- Full-stack projects
- Complex automation
- Deployment tasks
- Any coding task that sounds like it needs more than 5 minutes of work

Example trigger phrases:
- "Build me a..."
- "Create an app that..."
- "Make a system for..."
- "Develop a..."
- "Set up..."
- "Automate..."
