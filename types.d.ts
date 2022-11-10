import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
export interface CloudflareLoaderArgs extends LoaderArgs {
  context: {
    TWEETS_DB: D1Database;
  };
}

interface CloudflareContext {
  TWEETS_DB: D1Database;
}

export interface CloudflareLoaderArgs extends LoaderArgs {
  context: CloudflareContext;
}

export interface CloudflareActionArgs extends ActionArgs {
  context: CloudflareContext;
}
