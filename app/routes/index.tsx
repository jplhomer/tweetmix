import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { CloudflareActionArgs, CloudflareLoaderArgs } from "types";
import { D1QB } from "workers-qb";

type User = {
  id: number;
  email: string;
  username: string;
};

export async function loader({ context }: CloudflareLoaderArgs) {
  const ps = context.TWEETS_DB.prepare("SELECT * from users");
  const users = await ps.all<User>();

  invariant(users.results, "No users found");

  return json({ users: users.results });
}

export async function action({ request, context }: CloudflareActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;

  const qb = new D1QB(context.TWEETS_DB);

  try {
    await qb.insert({ tableName: "users", data: { email, username } });
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }

  return redirect("/");
}

export default function Index() {
  const { users } = useLoaderData<typeof loader>();
  const actionData = useActionData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Tweetmix</h1>

      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
      <Form action="/?index" method="post">
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        <label>
          Email
          <input type="email" name="email" />
        </label>
        <label>
          Username
          <input type="text" name="username" />
        </label>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
