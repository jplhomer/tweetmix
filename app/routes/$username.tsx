import { Outlet, useParams } from "@remix-run/react";
import { Heading } from "~/components/Text";

export default function Username() {
  const { username } = useParams();

  return (
    <>
      <Heading>@{username}</Heading>
      <Outlet />
    </>
  );
}
