"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// Same-origin: the BetterAuth handler lives at /api/auth in this app.
export const authClient = createAuthClient({ plugins: [jwtClient()] });

export const { useSession, signIn, signUp, signOut } = authClient;
