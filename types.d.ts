import type { AppLoadContext, DataFunctionArgs } from "@remix-run/cloudflare";

interface Queue<Body = any> {
  send(body: Body): Promise<void>;
}

interface TweetmixContext extends AppLoadContext {
  TWEETS_DB: D1Database;
  // QUEUE: Queue;
}

export interface TweetmixDataFunctionArgs extends DataFunctionArgs {
  context: TweetmixContext;
}
