import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        // Fetch CSRF token
        // const csrfResponse = await fetch(`http://localhost:8080/api/csrf`, {
        //   method: "GET",
        //   credentials: "include",
        // });
        // if (!csrfResponse.ok) {
        //   throw new Error("Failed to fetch CSRF token");
        // }
        // const csrfData = await csrfResponse.json();
        // const csrfToken = csrfData.token;

        // Authenticate with LDAP server
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
            return { token: data.token ,username: data.username };
          }

          throw new Error("Invalid response from server");
        } catch (err) {
          console.error("Login error:", err);
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
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
  debug: process.env.NEXT_PUBLIC_NODE_ENV === "development",
});
