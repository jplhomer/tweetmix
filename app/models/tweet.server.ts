import invariant from "tiny-invariant";
import type { TweetmixContext } from "types";
import { db } from "~/lib/db.server";
import { Model } from "./model.server";

export interface TweetData {
  id: number;
  userId: number;
  text: string;
  createdAt: Date;
}

export class Tweet extends Model<TweetData> {
  static async create(
    { text, userId }: { text: string; userId: number },
    context: TweetmixContext
  ) {
    const { results } = await db(context).insert({
      tableName: "tweets",
      data: {
        user_id: userId,
        text,
      },
      returning: "*",
    });

    return new Tweet(await this.serializeResults(results));
  }

  static async all(context: TweetmixContext) {
    const { results } = await db(context).fetchAll({
      tableName: "tweets",
      fields: "*",
      orderBy: "created_at DESC",
    });

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
    return {
      id: results.id as number,
      userId: results.user_id as number,
      text: results.text as string,
      createdAt: new Date(results.created_at),
    };
  }
}
