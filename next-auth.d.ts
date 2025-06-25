import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    token?: string;
  }
  interface Session {
    accessToken?: string; // Add accessToken to the Session type
  }
  interface JWT {
    accessToken?: string; // Match your jwt callback
  }
}