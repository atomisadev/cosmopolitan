import { SignedOut } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignedOut>
        <div>You have been signed out.</div>
    </SignedOut>
    </div>
  );
}
