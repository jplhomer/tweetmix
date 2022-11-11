import { json, redirect } from "@remix-run/cloudflare";
import { useMatches, useOutletContext } from "@remix-run/react";
import type { TweetmixDataFunctionArgs } from "types";
import { Heading } from "~/components/Text";
import { getUserId } from "~/lib/session.server";
import { TweetComposer } from "./resources/tweets/compose";

export async function loader({ request, context }: TweetmixDataFunctionArgs) {
  const userId = await getUserId(request);

  if (!userId) {
    return redirect("/");
  }

  return json({
    tweets: [],
  });
}

export default function Home() {
  // TODO: Find better way to access this?
  const { user } = useMatches()[0].data;

  return (
    <div>
      <Heading>Latest Tweets</Heading>
      <TweetComposer user={user} />
    </div>
  );
}
