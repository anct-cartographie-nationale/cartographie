const DEFAULT_TIMEOUT_MS = 30_000;

export const fetchApi =
  (
    { baseUrl, revalidate, token, noCache }: { baseUrl: string; revalidate: number; token: string; noCache?: boolean },
    headers: Headers
  ) =>
  <TRoute>(route: TRoute, queryParams?: string) =>
    fetch(`${baseUrl}/${route}${queryParams ? `?${queryParams}` : ''}`, {
      headers: { Authorization: `Bearer ${token}`, ...Object.fromEntries(headers) },
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      ...(noCache ? { cache: 'no-store' as const } : { next: { revalidate } })
    });
