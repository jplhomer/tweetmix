import { useParams } from "@remix-run/react";
import { ThiccTitle } from "~/components/Text";

export default function Username() {
  const { username } = useParams();

  return <ThiccTitle>@{username}</ThiccTitle>;
}
