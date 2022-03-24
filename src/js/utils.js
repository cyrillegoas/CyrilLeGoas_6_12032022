export async function fetchJson(path) {
  const res = await fetch(path);
  const data = await res.json();
  return data;
}
