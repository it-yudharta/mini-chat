// api/index.ts

interface Env {
  ASSETS: Fetcher;
  CHAT_DB: D1Database;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/chats")) {
      const { results } = await env.CHAT_DB.prepare("SELECT * FROM chats").all();
      return Response.json(results);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
