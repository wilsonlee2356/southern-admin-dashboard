import { GoogleIcon } from "@/assets/icons";

export default function GoogleSigninButton({ text, onClick }: { text: string, onClick: any }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray-2 p-[15px] font-medium hover:bg-opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-opacity-50">
      <GoogleIcon />
      {text} with Google
    </button>
  );
}
