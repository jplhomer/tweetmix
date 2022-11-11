import invariant from "tiny-invariant";
import type { TweetmixContext } from "types";
import { db } from "~/lib/db.server";
import { Model } from "./model.server";
import { User } from "./user.server";

export interface TweetData {
  id: number;
  userId: number;
  text: string;
  createdAt: Date;
  user?: User | null;
}

export class Tweet extends Model<TweetData> {
  static async create(
    { text, userId }: { text: string; userId: number },
    context: TweetmixContext
  ) {
    const { results } = await db(context).insert({
      tableName: "tweets",
      data: {
        created_at: new Date().toUTCString(),
        user_id: userId,
        text,
      },
      returning: "*",
    });

    return new Tweet(await this.serializeResults(results));
  }

  static async all(context: TweetmixContext) {
    const stmt = context.TWEETS_DB.prepare(
      `select
        tweets.*,
        users.username as user_username,
        users.email as user_email,
        users.name as user_name
      from tweets
      left join users
      on tweets.user_id = users.id
      order by tweets.created_at desc`
    );
    const { results } = await stmt.all();

    invariant(results, "Could not fetch tweets");

    return await this.convertResultsToModels(results);
  }

  static async find(tweetId: number, context: TweetmixContext): Promise<Tweet> {
    const { results } = await db(context).fetchOne({
      tableName: "tweets",
      fields: "*",
      where: {
        conditions: "id = ?1",
        params: [tweetId],
      },
    });

    invariant(results, "Tweet not found");

    return (await this.convertResultsToModels([results]))[0];
  }

  static async serializeResults(results: any) {
    const user = await this.convertRelationsToModels<User>(
      results,
      User,
      "user"
    );

    return {
      id: results.id as number,
      userId: results.user_id as number,
      text: results.text as string,
      createdAt: new Date(results.created_at),
      user,
    };
  }
}
