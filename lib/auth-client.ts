import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
  plugins: [adminClient()],
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
