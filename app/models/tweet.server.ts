import invariant from "tiny-invariant";
import type { TweetmixContext } from "types";
import { db } from "~/lib/db.server";
import { Model } from "./model.server";
import type { UserData } from "./user.server";
import { User } from "./user.server";

export interface TweetData {
  id: number;
  userId: number;
  text: string;
  createdAt: string;
  user?: UserData | null;
}

export class Tweet extends Model<TweetData> {
  get id() {
    return this.data.id;
  }

  get user() {
    return this.data.user;
  }

  get text() {
    return this.data.text;
  }

  get createdAt() {
    return this.data.createdAt;
  }

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

  static async all(context: TweetmixContext, where = ""): Promise<TweetData[]> {
    const stmt = context.TWEETS_DB.prepare(
      `select
        tweets.*,
        users.username as user_username,
        users.email as user_email,
        users.name as user_name
      from tweets
      left join users
      on tweets.user_id = users.id
      ${where ? `where ${where}` : ""}
      order by tweets.created_at desc`
    );
    const { results } = await stmt.all();

    invariant(results, "Could not fetch tweets");

    // TODO: Learn TypeScript
    return (await this.convertResultsToModels(
      results
    )) as unknown as TweetData[];
  }

  static async where(
    column: string,
    value: any,
    context: TweetmixContext
  ): Promise<TweetData[]> {
    return this.all(context, `${column} = '${value}'`);
  }

  static async find(
    tweetId: number,
    context: TweetmixContext
  ): Promise<TweetData> {
    const results = await this.where("tweets.id", tweetId, context);

    return results[0];
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
      createdAt: results.created_at,
      user,
    };
  }
}
