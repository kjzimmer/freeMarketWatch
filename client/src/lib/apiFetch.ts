export async function apiFetch<T>(path: string, options?: RequestInit): Promise<{ success: boolean; data: T }> {
  const token = localStorage.getItem('fmw_admin_token');
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
    throw err;
  }
  return res.json();
}
