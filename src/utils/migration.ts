import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db";

const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

async function migrate() {
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
  console.log("✅ Better-auth migrations done");
  process.exit(0);
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});