import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { TweetmixDataFunctionArgs } from "types";
import { Tweet } from "~/components/Tweet";
import { Tweet as TweetModel } from "~/models/tweet.server";
import { User } from "~/models/user.server";

export async function loader({ params, context }: TweetmixDataFunctionArgs) {
  invariant(params.username, "Username is required");

  const user = await User.findByUsername(params.username, context);

  invariant(user, "User not found");

  return json({
    tweets: await TweetModel.where("user_id", user.id, context),
  });
}

export default function UsernameIndex() {
  const { tweets } = useLoaderData<typeof loader>();

  return (
    <ul>
      {tweets.map((tweet) => (
        <li key={tweet.id}>
          <Tweet tweet={tweet} />
        </li>
      ))}
    </ul>
  );
}
