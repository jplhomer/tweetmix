import {
  ChatBubbleBottomCenterIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { json, redirect } from "@remix-run/cloudflare";
import { useFetcher, useLocation } from "@remix-run/react";
import clsx from "clsx";
import type { TweetmixDataFunctionArgs } from "types";
import { requireUserId } from "~/lib/session.server";
import { Tweet, type TweetData } from "~/models/tweet.server";

const enum LikeActions {
  Like = "like",
  Unlike = "unlike",
}

type ActionData = {
  formError?: string;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export async function loader() {
  /**
   * If anon users try to like a tweet, it will redirect them to login first.
   * But the `redirectTo` string is not good because this route does not have a view.
   * I don't know what to do other than to redirect them to the homepage. /shrug
   */
  return redirect("/");
}

export async function action({ request, context }: TweetmixDataFunctionArgs) {
  const [userId, formData] = await Promise.all([
    requireUserId(request),
    new URLSearchParams(await request.text()),
  ]);

  const intent = formData.get("intent");
  const tweetId = formData.get("tweetId");
  const redirectTo = formData.get("redirectTo");

  if (
    typeof intent !== "string" ||
    typeof tweetId !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: "Invalid form data",
    });
  }

  switch (intent) {
    case LikeActions.Like:
      // If the user already liked the tweet, do nothing.
      const tweet = await Tweet.find(Number(tweetId), context);
      if (await tweet.userHasLiked(userId, context)) {
        return redirect(redirectTo);
      }

      // Update likes
      await context.TWEETS_DB.prepare(
        `
        insert into tweet_likes (tweet_id, user_id)
        values (?1, ?2)
      `
      )
        .bind(tweetId, userId)
        .run();
      break;
    case LikeActions.Unlike:
      // Update likes
      await context.TWEETS_DB.prepare(
        `
        delete from tweet_likes where tweet_id = ?1 and user_id = ?2
      `
      )
        .bind(tweetId, userId)
        .run();
      break;
  }

  // Get new total likes for tweetId
  const totalLikes = await context.TWEETS_DB.prepare(
    `
    select count(*) as total_likes
    from tweet_likes
    where tweet_id = ?1
  `
  )
    .bind(tweetId)
    .first("total_likes");

  // Update the tweet with the number_likes
  await context.TWEETS_DB.prepare(
    `
    update tweets
    set number_likes = ?1
    where id = ?2
  `
  )
    .bind(totalLikes, tweetId)
    .run();

  return redirect(redirectTo);
}

export function ReplyButton({ tweet }: { tweet: TweetData }) {
  return (
    <button className="transition-all group">
      <div className="group-hover:bg-blue-200 rounded-full p-2">
        <ChatBubbleBottomCenterIcon className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
      </div>
      <span className="sr-only">Reply</span>
    </button>
  );
}

export function LikeButton({ tweet }: { tweet: TweetData }) {
  const location = useLocation();

  /**
   * We `useFetcher` here instead of the `<Form>` import because we don't want
   * the URL to be updated before the `redirect` happens.
   */
  const fetcher = useFetcher();

  return (
    <fetcher.Form replace action="/resources/tweets/stats" method="put">
      <input
        type="hidden"
        name="intent"
        value={tweet.hasLiked ? LikeActions.Unlike : LikeActions.Like}
      />
      <input type="hidden" name="tweetId" value={tweet.id} />
      <input
        type="hidden"
        name="redirectTo"
        value={location.pathname + location.search}
      />
      <button
        type="submit"
        className={clsx(
          "group flex items-center space-x-1 pr-2",
          tweet.hasLiked ? "text-pink-600" : "text-gray-500"
        )}
      >
        <div className="group-hover:bg-pink-200 group-hover:text-pink-600 dark:group-hover:bg-opacity-25 dark:group-hover:text-pink-200 rounded-full p-2 transition-all">
          {tweet.hasLiked ? (
            <SolidHeartIcon className="h-4 w-4" />
          ) : (
            <HeartIcon className="h-4 w-4" />
          )}
        </div>
        {/* Only display the count if it is greater than 0. */}
        {Boolean(tweet.numberLikes) && (
          <span className="text-sm group-hover:text-pink-600 dark:group-hover:text-pink-200 transition-all">
            {tweet.numberLikes}
          </span>
        )}
        <span className="sr-only">Like</span>
      </button>
    </fetcher.Form>
  );
}
