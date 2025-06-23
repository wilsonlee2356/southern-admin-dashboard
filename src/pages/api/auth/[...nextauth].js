const ldap = require("ldapjs");
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        username: { label: "username", type: "text", placeholder: "" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        const csrfResponse = await fetch(`http://localhost:8080/api/csrf`);

        if (!csrfResponse.ok) {
            throw new Error("Failed to fetch CSRF token");
        }

        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;

        console.log("Username: ", credentials.username, " Password: ", credentials.password, " CSRF Token: ", csrfToken);
        const username = credentials.username;
        const password = credentials.password;
        const response = await fetch(`http://localhost:8080/api/ldap/authenticate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-Token': csrfToken, // Include CSRF token in the headers
          },
          body: new URLSearchParams({
            username,
            password,
          }).toString(),
          credentials: 'include',
        });

        const data = await response.json();
        console.log("Response from LDAP server: ", data);

        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }

        if (data && data.username) {
            return {
              username: data.username,
              password: credentials.password,
            };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.username = user.username;
        token.password = user.password;
      }
      return token;
    },
    async session({ session, token }) {
      return { ...session, user: { username: token.username } };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
});
