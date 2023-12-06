import NextAuth, { DefaultSession, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    access_token?: string;
    user: {
      name?: string;
    } & DefaultSession["user"];
    error?: string; // used for error messages
  };

  // access and refresh tokens are named to match the backend
  interface User {
    user: {
      name?: string;
    };
    access?: string;
    refresh: string;
  };
}

declare module "next-auth/jwt" {
  interface JWT {
    name?: string;
    access_token?: string;
    refresh_token: string;
    access_ref?: number;
  };
}

