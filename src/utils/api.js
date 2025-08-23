export const API_BASE =
  import.meta.env.VITE_API_URL || "https://events-server-wnax.onrender.com";

export default async function getJSON(url, options = {}) {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

  const res = await fetch(fullUrl, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText };
    }
    throw new Error(err.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}
