import { Dispatch, SetStateAction, useState } from "react";

interface SignupWithPasswordProps {
  handleSubmit: (e: any) => void;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  isSigningUp: boolean;
}

export default function SignupWithPassword({
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
  isSigningUp,
}: SignupWithPasswordProps) {
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (value: string) => {
    // Basic email format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!value) {
      return "Email is required";
    }
    if (value.length > 254) {
      return "Email is too long (max 254 characters)";
    }
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }

    // Additional checks
    const [localPart, domain] = value.split("@");
    if (localPart.length > 64) {
      return "Local part of email is too long (max 64 characters)";
    }
    if (domain.length > 253) {
      return "Domain part of email is too long (max 253 characters)";
    }
    if (/\.\./.test(value)) {
      return "Email cannot contain consecutive dots";
    }

    return "";
  };

  const validatePassword = (value: string) => {
    const minLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase)
      return "Password must contain at least one uppercase letter";
    if (!hasLowerCase)
      return "Password must contain at least one lowercase letter";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasSpecialChar)
      return "Password must contain at least one special character";
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const error = validateEmail(newEmail);
    setEmailError(error);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const error = validatePassword(newPassword);
    setPasswordError(error);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (!emailErr && !passwordErr) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          className={`w-full rounded-[7px] border-[1.5px] ${
            emailError ? "border-red-500" : "border-stroke"
          } bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
          required
        />
        {emailError && (
          <p className="mt-2 text-sm text-red-500">{emailError}</p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
          className={`w-full rounded-[7px] border-[1.5px] ${
            passwordError ? "border-red-500" : "border-stroke"
          } bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
          required
        />
        {passwordError && (
          <p className="mt-2 text-sm text-red-500">{passwordError}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Password must contain: 8+ characters, uppercase, lowercase, number,
          and special character
        </p>
      </div>

      <button
        type="submit"
        disabled={isSigningUp || !!emailError || !!passwordError}
        className="w-full cursor-pointer rounded-[7px] border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-60"
      >
        {isSigningUp ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
