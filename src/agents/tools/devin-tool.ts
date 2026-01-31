import { Type } from "@sinclair/typebox";
import { ensureAuthProfileStore, listProfilesForProvider } from "../auth-profiles.js";
import type { AnyAgentTool } from "./common.js";
import { jsonResult, readStringParam } from "./common.js";

const DEVIN_API_BASE_URL = "https://api.devin.ai/v1";
const DEVIN_PROVIDER_ID = "devin";
const DEVIN_API_KEY_ENV = "DEVIN_API_KEY";

const DevinCreateSessionSchema = Type.Object({
  prompt: Type.String({ description: "The task or prompt to send to Devin" }),
  playbook_id: Type.Optional(
    Type.String({ description: "Optional playbook ID to use for the session" }),
  ),
  idempotent: Type.Optional(
    Type.Boolean({
      description: "If true, reuse an existing session with the same prompt if available",
    }),
  ),
});

const DevinSendMessageSchema = Type.Object({
  session_id: Type.String({ description: "The Devin session ID to send a message to" }),
  message: Type.String({ description: "The message to send to the Devin session" }),
});

const DevinGetStatusSchema = Type.Object({
  session_id: Type.String({ description: "The Devin session ID to get status for" }),
});

type DevinSessionResponse = {
  session_id: string;
  url?: string;
  status?: string;
  status_enum?: string;
};

type DevinMessageResponse = {
  message_id?: string;
  status?: string;
};

function resolveDevinApiKey(agentDir?: string): string | undefined {
  const envKey = process.env[DEVIN_API_KEY_ENV]?.trim();
  if (envKey) return envKey;

  const store = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
  const profiles = listProfilesForProvider(store, DEVIN_PROVIDER_ID);
  for (const profileId of profiles) {
    const profile = store.profiles[profileId];
    if (!profile) continue;
    if (profile.type === "api_key" && profile.key) return profile.key;
    if (profile.type === "token" && profile.token) return profile.token;
  }

  return undefined;
}

async function callDevinApi<T>(params: {
  method: "GET" | "POST";
  endpoint: string;
  apiKey: string;
  body?: Record<string, unknown>;
  timeoutMs?: number;
}): Promise<T> {
  const { method, endpoint, apiKey, body, timeoutMs = 30000 } = params;
  const url = `${DEVIN_API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Devin API error (${response.status}): ${errorText}`);
  }

  return (await response.json()) as T;
}

export function createDevinCreateSessionTool(opts?: { agentDir?: string }): AnyAgentTool {
  return {
    label: "Devin",
    name: "devin_create_session",
    description:
      "Create a new Devin session to delegate a complex coding task. Devin is an AI software engineer that can work on tasks autonomously. Returns the session ID and URL to monitor progress.",
    parameters: DevinCreateSessionSchema,
    execute: async (_toolCallId, args) => {
      const params = args as Record<string, unknown>;
      const prompt = readStringParam(params, "prompt", { required: true });
      const playbookId = readStringParam(params, "playbook_id");
      const idempotent = typeof params.idempotent === "boolean" ? params.idempotent : false;

      const apiKey = resolveDevinApiKey(opts?.agentDir);
      if (!apiKey) {
        return jsonResult({
          status: "error",
          error: `No Devin API key found. Set ${DEVIN_API_KEY_ENV} environment variable or configure devin auth profile.`,
        });
      }

      try {
        const body: Record<string, unknown> = { prompt };
        if (playbookId) body.playbook_id = playbookId;
        if (idempotent) body.idempotent = true;

        const response = await callDevinApi<DevinSessionResponse>({
          method: "POST",
          endpoint: "/sessions",
          apiKey,
          body,
        });

        const sessionUrl = response.url ?? `https://app.devin.ai/sessions/${response.session_id}`;

        return jsonResult({
          status: "success",
          session_id: response.session_id,
          url: sessionUrl,
          session_status: response.status_enum ?? response.status ?? "created",
          message: `Devin session created. Monitor progress at: ${sessionUrl}`,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return jsonResult({
          status: "error",
          error: errorMessage,
        });
      }
    },
  };
}

export function createDevinSendMessageTool(opts?: { agentDir?: string }): AnyAgentTool {
  return {
    label: "Devin",
    name: "devin_send_message",
    description:
      "Send a follow-up message to an existing Devin session. Use this to provide additional context, clarification, or new instructions to Devin.",
    parameters: DevinSendMessageSchema,
    execute: async (_toolCallId, args) => {
      const params = args as Record<string, unknown>;
      const sessionId = readStringParam(params, "session_id", { required: true });
      const message = readStringParam(params, "message", { required: true });

      const apiKey = resolveDevinApiKey(opts?.agentDir);
      if (!apiKey) {
        return jsonResult({
          status: "error",
          error: `No Devin API key found. Set ${DEVIN_API_KEY_ENV} environment variable or configure devin auth profile.`,
        });
      }

      try {
        const response = await callDevinApi<DevinMessageResponse>({
          method: "POST",
          endpoint: `/sessions/${sessionId}/messages`,
          apiKey,
          body: { message },
        });

        return jsonResult({
          status: "success",
          session_id: sessionId,
          message_id: response.message_id,
          message: "Message sent to Devin session successfully.",
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return jsonResult({
          status: "error",
          error: errorMessage,
          session_id: sessionId,
        });
      }
    },
  };
}

export function createDevinGetStatusTool(opts?: { agentDir?: string }): AnyAgentTool {
  return {
    label: "Devin",
    name: "devin_get_status",
    description:
      "Get the current status of a Devin session. Returns information about the session state, progress, and any outputs.",
    parameters: DevinGetStatusSchema,
    execute: async (_toolCallId, args) => {
      const params = args as Record<string, unknown>;
      const sessionId = readStringParam(params, "session_id", { required: true });

      const apiKey = resolveDevinApiKey(opts?.agentDir);
      if (!apiKey) {
        return jsonResult({
          status: "error",
          error: `No Devin API key found. Set ${DEVIN_API_KEY_ENV} environment variable or configure devin auth profile.`,
        });
      }

      try {
        const response = await callDevinApi<DevinSessionResponse>({
          method: "GET",
          endpoint: `/sessions/${sessionId}`,
          apiKey,
        });

        const sessionUrl = response.url ?? `https://app.devin.ai/sessions/${response.session_id}`;

        return jsonResult({
          status: "success",
          session_id: response.session_id,
          session_status: response.status_enum ?? response.status ?? "unknown",
          url: sessionUrl,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return jsonResult({
          status: "error",
          error: errorMessage,
          session_id: sessionId,
        });
      }
    },
  };
}

export function createDevinTools(opts?: { agentDir?: string }): AnyAgentTool[] {
  return [
    createDevinCreateSessionTool(opts),
    createDevinSendMessageTool(opts),
    createDevinGetStatusTool(opts),
  ];
}
