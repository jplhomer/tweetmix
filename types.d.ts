import type { AppLoadContext, DataFunctionArgs } from "@remix-run/cloudflare";

interface TweetmixContext extends AppLoadContext {
  TWEETS_DB: D1Database;
}

export interface TweetmixDataFunctionArgs extends DataFunctionArgs {
  context: TweetmixContext;
}
