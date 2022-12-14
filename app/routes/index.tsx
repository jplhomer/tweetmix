import { json, redirect } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { TweetmixDataFunctionArgs, TweetmixDataFunctionArgs } from "types";
import { D1QB } from "workers-qb";
import { getUserId } from "~/lib/session.server";

type User = {
  id: number;
  name: string;
  email: string;
  username: string;
};

export async function loader({ request, context }: TweetmixDataFunctionArgs) {
  const userId = await getUserId(request);

  return redirect(userId ? "/home" : "/explore");
}

/**
 * Hash some text using Sha-256.
 * NOTE: This is bad; don't do this; use bcrypt instead.
 */
async function hash(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function action({ request, context }: TweetmixDataFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = await hash(formData.get("password") as string);

  const qb = new D1QB(context.TWEETS_DB);

  try {
    await qb.insert({
      tableName: "users",
      data: { email, username, name, password },
    });
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }

  return redirect("/");
}

export default function Index() {
  const { users } = useLoaderData<typeof loader>();
  const actionData = useActionData();

  return (
    <>
      <h1>This is Tweetmix home.</h1>
    </>
  );
}
