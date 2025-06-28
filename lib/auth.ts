import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db'; // your drizzle instance
import * as schema from '@/db/schema/auth-schema';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  trustedOrigins: ['http://localhost:3000'],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    nextCookies(),
    admin({
      adminRoles: ['admin', 'superadmin'],
    }),
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema: {
      verifications: schema.verifications,
      sessions: schema.sessions,
      accounts: schema.accounts,
      users: schema.users,
    },
  }),
});
