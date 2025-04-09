"use client";
import { useSession } from "@/components/session-context";

export default function Home() {
  const session = useSession();

  return <p>{JSON.stringify(session, null, `\t`)}</p>;
}
