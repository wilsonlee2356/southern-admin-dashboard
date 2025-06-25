import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        try{
          const bodyData = new URLSearchParams({
            username: credentials.username,
            password: credentials.password,
          });
          console.log("LDAP body data:", bodyData.toString());
          const response = await fetch(
            `http://localhost:8080/api/ldap/authenticate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: bodyData,
              credentials: "include",
            },
          );

          const data = await response.json();
          console.log("LDAP response:", data.token);

          if (!response.ok) {
            throw new Error(data.message || "Authentication failed");
          }

          if (data && data.token) {
              return {
                id: credentials.username,
                name: credentials.username,
                token: data.token,
              };
          }

          throw new Error("Invalid response from server");

          return null;
        } catch (err) {
          console.error("Login error:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.token) {
        // token.username = user.username;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      // return { ...session, user: { username: token.username } };
      if(typeof token.accessToken === 'string'){
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    // encryption: true,
  },
  
};
export default NextAuth(authOptions);