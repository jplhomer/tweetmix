import type { AppLoadContext, DataFunctionArgs } from "@remix-run/cloudflare";

interface TweetmixContext extends AppLoadContext {
  TWEETS_DB: D1Database;
}

export interface TweetmixLoaderArgs extends DataFunctionArgs {
  context: TweetmixContext;
}

export interface TweetmixActionArgs extends DataFunctionArgs {
  context: TweetmixContext;
}
