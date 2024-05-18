"use client";

import { SignInButton, useUser } from "@clerk/nextjs";

import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  if (isLoaded && isSignedIn) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex justify-center h-screen items-center">
      <SignInButton>
        <button className="bg-white text-black font-medium py-2 px-4 rounded-lg hover:bg-white/80 transition ease-in-out duration-100">
          Sign in with Clerk
        </button>
      </SignInButton>
    </div>
  );
}
