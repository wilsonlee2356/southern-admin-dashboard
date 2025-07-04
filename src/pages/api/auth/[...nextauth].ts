import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const getApiUrl = (endpoint: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_BASE_URL is not defined");
  }
  return `${baseURL}${endpoint}`;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }
        try {
          const bodyData = new URLSearchParams({
            username: credentials.username,
            password: credentials.password,
          });
          console.log("LDAP body data:", bodyData.toString());
          const response = await fetch(getApiUrl(`/api/ldap/authenticate`), {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: bodyData,
            credentials: "include",
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Authentication failed");
          }
          console.log("Login back message: ",data);
          if (data?.accessToken && data?.refreshToken) {
            console.log("Returning user");
            return {
              id: credentials.username,
              name: credentials.username,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              role: data.roles[0], // Include role
              username: data.username,
            };
          }

          throw new Error("Invalid response from server");
        } catch (err) {
          console.error("Login error:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    signOut: undefined,
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl });
      // Check if this is a sign-out redirect (url contains /api/auth/signout)
      if (url.includes("/api/auth/signout")) {
        return `${baseUrl}/auth/sign-in`; // Direct to sign-in page on sign-out
      }
      // For sign-in or other redirects, use callbackUrl or default to /
      const callbackUrl = new URL(url, baseUrl).searchParams.get("callbackUrl");
      if (callbackUrl && callbackUrl.startsWith("/")) {
        return `${baseUrl}${callbackUrl}`;
      }
      return `${baseUrl}/`;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in
      if (user) {
        // console.log("jwt callback (sign-in): ", user);
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.username = user.username;
      }
      // Session update triggered by client (e.g., via update())
      if (trigger === "update" && session) {
        // console.log("jwt callback (update): ", session);
        token.accessToken = session.accessToken || token.accessToken;
        token.refreshToken = session.refreshToken || token.refreshToken;
        token.role = session.role || token.role;
        token.username = session.username || token.username;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("session callback: ", token, " ,\n ", session);
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      session.username = token.username;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};
export default NextAuth(authOptions);
