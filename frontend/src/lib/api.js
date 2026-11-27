const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

async function readJson(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `API error (${response.status})`);
  return body;
}

export async function submitCollectionRequest({ image, ...fields }) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.append(key, value ?? ""));
  form.append("image", image);
  const result = await readJson(await fetch(`${API_BASE}/api/requests`, { method: "POST", body: form }));
  return result.request;
}

export async function getCollectionRequests() {
  const result = await readJson(await fetch(`${API_BASE}/api/requests`));
  return result.requests;
}

export function getRequestImageUrl(imageUrl) {
  return imageUrl ? new URL(imageUrl, API_BASE).toString() : "";
}
