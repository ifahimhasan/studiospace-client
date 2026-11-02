/** Uploads an image file to imgbb and returns its public URL. */
export async function uploadToImgbb(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("Image upload isn't configured. Paste an image URL instead.");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Images must be 5 MB or smaller.");

  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.data?.url) throw new Error(json?.error?.message || "Upload failed. Try again or paste a URL.");
  return json.data.display_url || json.data.url;
}
