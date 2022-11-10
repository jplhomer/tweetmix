import { Form } from "@remix-run/react";
import { FloatingLabelInput } from "~/components/Form";
import { ThiccTitle } from "~/components/Text";

export default function Signup() {
  return (
    <Form method="post" className="max-w-lg">
      <ThiccTitle>Create your account</ThiccTitle>
      <div className="space-y-4">
        <FloatingLabelInput name="email" type="email" label="Email" />
        <FloatingLabelInput name="password" type="password" label="Password" />
        <FloatingLabelInput name="username" type="text" label="Username" />
      </div>
    </Form>
  );
}
