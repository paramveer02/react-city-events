export default async function getJSON(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Something went wrong!");
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("❌ Fetch error:", e.message);
    throw e;
  }
}
