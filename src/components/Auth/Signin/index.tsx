import Link from "next/link";
import SigninWithPassword from "../SigninWithPassword";
// import { useAuth } from "@/contexts/authContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signin() {
  // const { currentUser, userLoggedIn } = useAuth();

  // const onSubmit = async (e: any) => {
  //   e.preventDefault();
  //   setIsSigningIn(true);
  //   try {
  //     await doSignInWithEmailAndPassword(email, password);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsSigningIn(false);
  //   }
  // };

  // const onGoogleSignin = async (e: any) => {
  //   e.preventDefault();
  //   setIsSigningIn(true);
  //   try {
  //     await doSignInWithGoogle();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <>
      {/* <GoogleSigninButton onClick={onGoogleSignin} text="Sign in" /> */}

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
