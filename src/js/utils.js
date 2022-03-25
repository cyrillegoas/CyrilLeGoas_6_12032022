export async function fetchJson(path) {
  const res = await fetch(path);
  const data = await res.json();
  return data;
}

/* eslint-disable */
export const wait = (amount = 0) =>
  new Promise((resolve) => setTimeout(resolve, amount));
/* eslint-enable */
