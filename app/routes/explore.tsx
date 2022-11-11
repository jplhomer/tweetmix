import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import type { TweetmixDataFunctionArgs } from "types";
import { Heading } from "~/components/Text";
import { TweetTimeline } from "~/components/TweetTimeline";
import { Tweet } from "~/models/tweet.server";

export async function loader({ context }: TweetmixDataFunctionArgs) {
  return json({
    tweets: await Tweet.all(context),
  });
}

export default function Explore() {
  const { tweets } = useLoaderData<typeof loader>();

  return (
    <div className="relative pt-16">
      <Heading>Explore</Heading>
      <TweetTimeline tweets={tweets} />
    </div>
  );
}
