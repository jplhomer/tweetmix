import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData, useMatches } from "@remix-run/react";
import type { TweetmixDataFunctionArgs } from "types";
import { Heading } from "~/components/Text";
import { Tweet } from "~/components/Tweet";
import { getUserId } from "~/lib/session.server";
import { Tweet as TweetModel } from "~/models/tweet.server";
import { TweetComposer } from "./resources/tweets/compose";

export async function loader({ request, context }: TweetmixDataFunctionArgs) {
  const userId = await getUserId(request);

  if (!userId) {
    return redirect("/");
  }

  return json({
    tweets: await TweetModel.all(context),
  });
}

export default function Home() {
  // TODO: Find better way to access this?
  const { user } = useMatches()[0].data;
  const { tweets } = useLoaderData<typeof loader>();

  return (
    <div>
      <Heading>Latest Tweets</Heading>
      <TweetComposer user={user} />
      <div className="border-t border-gray-300 dark:border-gray-600">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="p-4">
            <Tweet tweet={tweet} />
          </div>
        ))}
      </div>
    </div>
  );
}
