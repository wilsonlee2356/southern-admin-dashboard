"use client";
import Signin from "@/components/Auth/Signin";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function SignIn() {
  return (
    <>
      <Breadcrumb pageName="Sign In" />

      <div className="flex justify-center rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mx-auto w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-15">
            <Signin />
          </div>
        </div>
      </div>
    </>
  );
}
