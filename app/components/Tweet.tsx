import type { TweetData } from "~/models/tweet.server";
import { getRelativeTime } from "~/utils";
import { UserAvatar } from "./UserAvatar";

export function Tweet({ tweet }: { tweet: TweetData }) {
  return (
    <UserAvatar user={tweet.user!}>
      <div className="space-x-1">
        <span className="font-bold">
          {tweet.user!.name ?? tweet.user!.username}
        </span>
        <span className="text-gray-500">@{tweet.user!.username}</span>
        <span className="text-gray-500">&bull;</span>
        <span className="text-gray-500">
          {getRelativeTime(new Date(tweet.createdAt))}
        </span>
      </div>
      <div>{tweet.text}</div>
    </UserAvatar>
  );
}
