import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useLocation } from "@remix-run/react";
import type { TweetmixDataFunctionArgs } from "types";
import { Button } from "~/components/Form";
import type { UserData } from "~/models/user.server";

type ActionData = {
  formError?: string;
  fields?: {
    tweet: string;
  };
  fieldErrors?: {
    tweet?: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export async function action({ request, context }: TweetmixDataFunctionArgs) {
  const formData = new URLSearchParams(await request.text());

  const tweet = formData.get("tweet");
  const redirectTo = formData.get("redirectTo");

  if (typeof tweet !== "string" || typeof redirectTo !== "string") {
    return badRequest({
      formError: "Invalid form data",
    });
  }

  const fields = { tweet };
  const fieldErrors = {
    // TODO: Validate length
    tweet: tweet ? undefined : "Tweet text is required",
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fields,
      fieldErrors,
    });
  }

  return redirect(redirectTo);
}

export function TweetComposer({ user }: { user: UserData }) {
  const actionData = useActionData();
  const location = useLocation();

  return (
    <Form
      method="post"
      action="/resources/tweets/compose"
      className="flex space-x-4 p-4"
    >
      <div className="shrink">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="grow">
        <input type="hidden" name="redirectTo" value={location.pathname} />
        <textarea
          className="block w-full border-b border-gray-300 dark:border-gray-600 p-2 text-lg mb-2"
          name="tweet"
          placeholder="What's happening?"
          defaultValue={actionData?.tweet}
        />
        <div className="flex justify-end">
          <Button type="submit">Tweet</Button>
        </div>
      </div>
    </Form>
  );
}
