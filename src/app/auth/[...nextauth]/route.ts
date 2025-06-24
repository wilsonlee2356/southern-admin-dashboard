// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { JWT } from 'next-auth/jwt';
// import { User, Session } from 'next-auth';

// export const authOption = {
//   providers: [
//     CredentialsProvider({
//       name: "LDAP",
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         if (!credentials?.username || !credentials?.password) {
//           throw new Error("Missing username or password");
//         }

//         // Fetch CSRF token
//         // const csrfResponse = await fetch(`http://localhost:8080/api/csrf`, {
//         //   method: "GET",
//         //   credentials: "include",
//         // });
//         // if (!csrfResponse.ok) {
//         //   throw new Error("Failed to fetch CSRF token");
//         // }
//         // const csrfData = await csrfResponse.json();
//         // const csrfToken = csrfData.token;

//         // Authenticate with LDAP server
//         const bodyData = new URLSearchParams({
//           username: credentials.username,
//           password: credentials.password,
//         });
//         console.log("LDAP body data:", bodyData.toString());
//         try {
//             const response = await fetch(
//                 `http://127.0.0.1:8000/api/ldap/authenticate`,
//                 {
//                     method: "POST",
//                     headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                     // "X-CSRF-Token": csrfToken,
//                     },
//                     body: bodyData,
//                     credentials: "include",
//                 },
//             );
//             const data = await response.json();
//             console.log("LDAP response:", data.token);

//             if (!response.ok) {
//                 throw new Error(data.message || "Authentication failed");
//             }

//             if (data && data.token) {
//                 return { token: data.token ,username: data.username };
//             }
//         } catch (error) {
//           console.error("LDAP authentication error:", error);
//             throw new Error("LDAP authentication failed");
//         }

        

//         throw new Error("Invalid response from server");
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/signin",
//   },
//   callbacks: {
//     async jwt({ token, user }:{ token: JWT; user?: User }) {
//       if (token) {
//         token.username = user;
//       }
//       return token;
//     },
//     async session({ session, token }: { session: Session; token: JWT }) {
//       return { ...session, user: { username: token.username } };
//     },
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 24 * 60 * 60, // 1 days
//     updateAge: 24 * 60 * 60, // 24 hours
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   jwt: {
//     secret: process.env.NEXTAUTH_SECRET,
//     encryption: true,
//   },
//   debug: process.env.NODE_ENV === "development",
// };
