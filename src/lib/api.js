"use client";

import { authClient } from "./auth-client";

// Proxied to the Express API by the rewrite in next.config.mjs.
const BASE = "/backend/api";

/**
 * Gets a fresh JWT from BetterAuth and hands it to the API, which stores it
 * in an HTTPOnly cookie. Called after login and whenever the API says 401.
 */
export async function syncJwt() {
  try {
    const { data } = await authClient.token();
    if (!data?.token) return false;
    const res = await fetch(`${BASE}/auth/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: data.token }),
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function clearJwt() {
  await fetch(`${BASE}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
}

/** JSON fetch against the Express API with one automatic re-sync on 401. */
export async function api(path, { method = "GET", body, retry = true } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401 && retry && (await syncJwt())) {
    return api(path, { method, body, retry: false });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}
