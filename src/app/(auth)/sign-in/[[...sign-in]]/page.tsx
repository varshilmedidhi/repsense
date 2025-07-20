import { SignIn } from "@clerk/nextjs";
import React from "react";

const SingInPage = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn path="/auth/sign-in" routing="path" signUpUrl="/sign-up" />
    </main>
  );
};

export default SingInPage;
