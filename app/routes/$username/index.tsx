import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { TweetmixDataFunctionArgs } from "types";
import { TweetTimeline } from "~/components/TweetTimeline";
import { getUserId } from "~/lib/session.server";
import { Tweet as TweetModel } from "~/models/tweet.server";
import { User } from "~/models/user.server";

export async function loader({
  request,
  params,
  context,
}: TweetmixDataFunctionArgs) {
  const userId = await getUserId(request);

  invariant(params.username, "Username is required");

  const user = await User.findByUsername(params.username, context);

  invariant(user, "User not found");

  return json({
    tweets: await TweetModel.where("user_id", user.id, context, userId),
  });
}

export default function UsernameIndex() {
  const { tweets } = useLoaderData<typeof loader>();

  return <TweetTimeline tweets={tweets} />;
}
