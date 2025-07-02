"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LogOutIcon, LogInIcon } from "./icons";
// import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const getApiUrl = (endpoint: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_BASE_URL is not defined");
  }
  return `${baseURL}${endpoint}`;
};

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  // const { userLoggedIn, currentUser } = useAuth();
  const router = useRouter();
  // const { userLoggedIn, logout } = useAuth();
  const { data: session, status } = useSession();

  // const USER = {
  //   name: currentUser?.providerData[0]?.displayName,
  //   email: currentUser?.providerData[0]?.email,
  //   img: currentUser?.providerData[0]?.photoURL,
  // };

  const handleLogout = async () => {
    if (status !== "authenticated" || !session?.accessToken) {
      console.error("Logout Error: No session or accessToken");
      return;
    }

    try {
      console.log(
        "Sending logout request to backend with token:",
        session.accessToken,
      );
      const response = await fetch(getApiUrl("/api/ldap/logout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
        credentials: "include",
      });

      const responseData = await response.json();
      console.log("Logout Response:", responseData, "Status:", response.status);

      if (!response.ok) {
        console.error("Logout Failed:", responseData);
        throw new Error(responseData.message || "Logout failed");
      }

      // Clear NextAuth session
      await signOut({ callbackUrl: "/auth/sign-in" });
    } catch (err) {
      console.log("Error: " + (err as Error).message);
    }
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <>
        <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
          <span className="sr-only">My Account</span>

          <figure className="flex items-center gap-3">
            <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
              <span>{(status !== "authenticated" || !session?.accessToken) ? "Login" : session.username}</span>

              <ChevronUpIcon
                aria-hidden
                className={cn(
                  "rotate-180 transition-transform",
                  isOpen && "rotate-0",
                )}
                strokeWidth={1.5}
              />
            </figcaption>
          </figure>
        </DropdownTrigger>

        {(status !== "authenticated" || !session?.accessToken) ? 
        <DropdownContent
          className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
          align="end"
        >
          <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
            <button
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              onClick={() => {
                
                router.push("/auth/sign-in");
              }}
            >
              <LogInIcon className="fill-grey"/>

              <span className="text-base font-medium">Sign in</span>

            </button>
          </div>
        </DropdownContent>
        :<DropdownContent
          className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
          align="end"
        >
          <h2 className="sr-only">User information</h2>

          <figure className="flex items-center gap-2.5 px-5 py-3.5">
            <figcaption className="space-y-1 text-base font-medium">
              <div className="mb-2 leading-none text-dark dark:text-white">
                {session.username}
              </div>

              <div className="leading-none text-gray-6">{session.role}</div>
            </figcaption>
          </figure>

          <hr className="border-[#E8E8E8] dark:border-dark-3" />

          <hr className="border-[#E8E8E8] dark:border-dark-3" />

          <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
            <button
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              onClick={() => {
                setIsOpen(false);
                // logout();
                // doSignOut();
                handleLogout();
                router.push("/");
              }}
            >
              <LogOutIcon />

              <span className="text-base font-medium">Sign out</span>
            </button>
          </div>
        </DropdownContent>}
      </>
      {/* ) : (
        <>
          <Link href="/auth/sign-in" className="text-primary">
            Sign In
          </Link>
        </>
      )} */}
    </Dropdown>
  );
}
