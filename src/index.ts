import { Container, getContainer } from "@cloudflare/containers";

interface Env {
  LINKEDIN_MCP: DurableObjectNamespace<LinkedInMcp>;
  MCP_AUTH_TOKEN: string;       // bearer token clients must send
  LINKEDIN_SESSION_B64: string; // tar.gz of cookies.json + source-state.json
}

export class LinkedInMcp extends Container<Env> {
  defaultPort = 8000;
  sleepAfter = "15m"; // a cold start re-launches Chromium, so don't sleep too eagerly

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.envVars = { LINKEDIN_SESSION_B64: env.LINKEDIN_SESSION_B64, LOG_LEVEL: "WARNING" };
  }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (!isAuthorized(req, env)) {
      return new Response("Unauthorized", { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
    }
    // One instance: there is one LinkedIn account and one browser profile.
    return getContainer(env.LINKEDIN_MCP, "singleton").fetch(req);
  },
};

// Anyone who reaches this URL can act as your LinkedIn account.
function isAuthorized(req: Request, env: Env): boolean {
  // TODO(you): decide how clients prove who they are.
  return false;
}
