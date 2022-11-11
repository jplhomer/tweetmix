import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";
import invariant from "tiny-invariant";
import type { TweetmixContext } from "types";
import { db } from "./db.server";

export interface RegisterForm {
  username: string;
  password: string;
  email: string;
}

export async function register(
  context: TweetmixContext,
  { username, email, password }: RegisterForm
) {
  const passwordHash = await unsafeHash(password);
  const { results, success } = await db(context).insert({
    tableName: "users",
    data: { username, password: passwordHash, email },
    returning: "*",
  });

  invariant(
    success && results,
    "User was not registered; an error has occurred."
  );

  return { id: results[0].id as string, username };
}

export async function login(
  context: TweetmixContext,
  { username, password }: { username: string; password: string }
) {
  const { results: user } = await db(context).fetchOne({
    tableName: "users",
    fields: "*",
    where: {
      conditions: "username = ?1",
      params: [username],
    },
  });

  if (!user) return null;

  const isCorrectPassword = (await unsafeHash(password)) === user.password;
  if (!isCorrectPassword) return null;

  return {
    id: user.id as string,
    username,
  };
}

/**
 * Hash some text using Sha-256.
 * NOTE: This is bad; don't do this; use bcrypt instead.
 */
async function unsafeHash(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "tweetmix_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: ["REPLACE_ME_WITH_A_REAL_SECRET"],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}
