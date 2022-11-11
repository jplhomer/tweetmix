import { Form } from "@remix-run/react";
import { Link } from "react-router-dom";
import { ThiccTitle } from "~/components/Text";

export default function Login() {
  return (
    <Form method="post" className="space-y-8">
      <ThiccTitle>SIgn in to Tweetmix</ThiccTitle>

      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Don't have an account?{" "}
        <Link className="text-blue-500" to="/auth/signup">
          Sign up
        </Link>
      </p>
    </Form>
  );
}
