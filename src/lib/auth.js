import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { resolveMongoUri } from "./resolve-mongo-uri.js";

const mongoUri = await resolveMongoUri(
  process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017"
);
const client = new MongoClient(mongoUri);
const db = client.db(process.env.DB_NAME || "Prompt_Verse");

const baseURL =   process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://prompt-veres-server.vercel.app"

console.log("better-auth baseURL:", baseURL);
console.log("better-auth cookie sameSite (dev=false->none):", process.env.NODE_ENV === 'production' ? 'none (production)' : 'lax (development)');

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://promet-veres-system.vercel.app",
  "https://prompt-veres-server.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);



export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,

  trustedOrigins: [
    ...allowedOrigins,
    "https://*.vercel.app", // allow all Vercel preview deployments
  ],

  advanced: {
    crossSubdomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
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
