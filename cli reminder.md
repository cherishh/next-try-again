- set secrets: `npx wrangler secret put UPSTASH_REDIS_REST_URL`
- db:
  1. first `npx @better-auth/cli generate` to create the auth-schema
  2. then `npx drizzle-kit generate` to create the migrations
  3. then `npx drizzle-kit migrate` to apply

