import { json } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import type { TweetmixActionArgs } from "types";
import { FloatingLabelInput } from "~/components/Form";
import { ThiccTitle } from "~/components/Text";
import { db } from "~/lib/db.server";
import { createUserSession, register } from "~/lib/session.server";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
  };
  fields?: {
    username: string;
    email: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export async function action({ request, context }: TweetmixActionArgs) {
  const formData = new URLSearchParams(await request.text());

  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { email, password, username };
  const fieldErrors = {
    email: !email?.length ? "Email is required" : undefined,
    password: !password?.length ? "Password is required" : undefined,
    username: !username?.length ? "Username is required" : undefined,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fields,
      fieldErrors,
    });
  }

  const existingUserResults = await db(context).fetchOne({
    tableName: "users",
    fields: "email, username",
    where: {
      conditions: "email = ?1 and username = ?2",
      params: [email, username],
    },
  });
  if (existingUserResults.results) {
    return badRequest({
      fields,
      fieldErrors: {
        email: "Email already in use",
        username: "Username already in use",
      },
    });
  }

  const user = await register(context, { username, email, password });

  return createUserSession(user.id, "/");
}

export default function Signup() {
  const actionData = useActionData<ActionData>();

  return (
    <Form method="post" className="max-w-lg space-y-8">
      <ThiccTitle>Create your account</ThiccTitle>
      <div className="space-y-4">
        <FloatingLabelInput
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          required
          defaultValue={actionData?.fields?.email}
          error={actionData?.fieldErrors?.email}
        />
        <FloatingLabelInput
          name="username"
          type="text"
          label="Username"
          required
          defaultValue={actionData?.fields?.username}
          error={actionData?.fieldErrors?.username}
        />
        <FloatingLabelInput
          name="password"
          type="password"
          label="Password"
          required
          defaultValue={actionData?.fields?.password}
          error={actionData?.fieldErrors?.password}
        />
        {actionData?.formError && (
          <div className="text-red-500 dark:text-red-300" role="alert">
            {actionData.formError}
          </div>
        )}
      </div>
      <button className="block p-4 rounded-full bg-blue-500 text-white font-bold w-full hover:bg-blue-600">
        Sign Up
      </button>
    </Form>
  );
}
