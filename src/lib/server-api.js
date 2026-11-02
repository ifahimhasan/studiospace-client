import "server-only";

const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");

/** Server-component fetch to the Express API. Returns `fallback` if the API is unreachable. */
export async function serverGet(path, { revalidate = 60, fallback = null } = {}) {
  try {
    const res = await fetch(`${API_URL}/api${path}`, { next: { revalidate } });
    if (res.status === 404) return { notFound: true };
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}
