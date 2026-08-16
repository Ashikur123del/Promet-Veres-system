import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { resolveMongoUri } from "./resolve-mongo-uri";

const mongoUri = await resolveMongoUri(
  process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017"
);
const client = new MongoClient(mongoUri);
const db = client.db(process.env.DB_NAME || "Prompt_Verse");

// Server URL (better-auth endpoint)
const baseURL =
  process.env.BETTER_AUTH_URL || "https://prompt-veres-server.vercel.app";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,

  // Client origins যা থেকে Request আসবে
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://promet-veres-system.vercel.app", // Client Production URL
    "https://prompt-veres-server.vercel.app",  // Server Production URL
  ],

  // Cross-Domain Cookie এবং CORS পারমিশন
  advanced: {
    crossSubdomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "user",
      },
      isPremium: {
        type: "boolean",
        input: false,
        defaultValue: false,
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
  plugins: [
    jwt({
      jwks: {
        disablePrivateKeyEncryption: true,
      },
    }),
    nextCookies(),
  ],
});