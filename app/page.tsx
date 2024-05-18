"use client"

import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  if (isLoaded && isSignedIn) {
    router.push("/dashboard");
    return null;
  }

  return <SignInButton />;
}
