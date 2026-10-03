const TOKEN_KEY = "accessToken";
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const putAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY);

export async function apiFetch(path, { method = "GET", body, form, params, auth = true } = {}) {
  const url = new URL(DELCOM_BASEURL + path, window.location.origin);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  const headers = { Accept: "application/json" };
  const token = getAccessToken();
  if (token && auth) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(url, { method, headers, body: payload, credentials: "omit" });
  const json = await res.json().catch(() => null);
  // API Delcom memakai { success: true } (sebagian versi { status: "success" }); terima keduanya.
  const ok = json ? (json.success === true || json.status === "success") : false;
  if (!ok) {
    const err = new Error(json?.message || "Terjadi kesalahan");
    err.status = res.status;
    err.fields = json?.data;
    throw err;
  }
  return json;
}