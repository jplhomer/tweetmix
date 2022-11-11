import invariant from "tiny-invariant";
import type { TweetmixContext } from "types";
import { db } from "~/lib/db.server";
import { getUserId } from "~/lib/session.server";
import { unsafeHash } from "~/utils";

export interface User {
  id: number;
  email: string;
  username: string;
  name?: string;
  avatarUrl: string;
}

export async function getUser(
  request: Request,
  context: TweetmixContext
): Promise<User | null> {
  const userId = await getUserId(request);

  if (!userId) return null;

  const { results } = await db(context).fetchOne({
    tableName: "users",
    fields: "*",
    where: {
      conditions: "id = ?1",
      params: [userId],
    },
  });

  invariant(results, "User not found");

  return {
    id: results.id as number,
    email: results.email as string,
    username: results.username as string,
    name: results.name as string,
    avatarUrl:
      "https://www.gravatar.com/avatar/" +
      (await unsafeHash((results.email as string).toLowerCase(), "MD5")),
  };
}
