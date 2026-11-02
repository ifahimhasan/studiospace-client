import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { db } from "./mongodb";
import { passwordProblems } from "./password";

const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    // After registering, people are sent to the Login page (assignment rule).
    autoSignIn: false,
  },
  socialProviders: hasGoogle
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
    : {},
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_SITE_URL].filter(Boolean),
  hooks: {
    // Enforce the password rules on the server too, not only in the form.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const problems = passwordProblems(ctx.body?.password || "");
      if (problems.length) {
        throw new APIError("BAD_REQUEST", { message: `Password needs ${problems.join(", ")}.` });
      }
    }),
  },
  plugins: [
    // Issues the JWT the Express API keeps in an HTTPOnly cookie.
    jwt({ jwt: { expirationTime: "7d" } }),
    nextCookies(),
  ],
});
