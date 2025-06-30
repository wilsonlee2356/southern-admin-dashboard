import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SignupWithPassword from "../SignupWithPassword";
import { useAuth } from "@/contexts/authContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const { currentUser, userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsSigningUp(true);
    try {
      // await doCreateUserWithEmailAndPassword(email, password);
      router.push("/"); // Redirect to home page after successful signup
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningUp(false);
    }
  };

  const onGoogleSignin = async (e: any) => {
    e.preventDefault();
    setIsSigningUp(true);
    try {
      // await doSignInWithGoogle();
      router.push("/"); // Redirect to home page after successful signup
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <>
      <h2 className="mb-9 text-2xl font-bold text-dark dark:text-white sm:text-[34px]">
        Create Your Account
      </h2>

      <GoogleSigninButton onClick={onGoogleSignin} text="Sign up" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign up with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SignupWithPassword
          handleSubmit={onSubmit}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isSigningUp={isSigningUp}
        />
      </div>

      <div className="mt-6 text-center">
        <p>
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
