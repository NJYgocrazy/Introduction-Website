const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:3000";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export function apiBaseUrl() {
  return API_BASE;
}

export async function apiJson<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  token?: string
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }

  return (await res.json()) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiJson<T>(path, "GET");
}

export async function apiAdminGet<T>(path: string, token: string): Promise<T> {
  return apiJson<T>(path, "GET", undefined, token);
}

export async function apiAdminPost<T>(path: string, token: string, body: unknown): Promise<T> {
  return apiJson<T>(path, "POST", body, token);
}

export async function apiAdminPut<T>(path: string, token: string, body: unknown): Promise<T> {
  return apiJson<T>(path, "PUT", body, token);
}

export async function apiAdminDelete<T>(path: string, token: string): Promise<T> {
  return apiJson<T>(path, "DELETE", undefined, token);
}

export async function apiAdminUpload(path: string, token: string, file: File) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: fd
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }

  return (await res.json()) as { filename: string; url: string };
}
