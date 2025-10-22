export const fetchApi =
  ({ baseUrl, revalidate, token }: { baseUrl: string; revalidate: number; token: string }, headers: Headers) =>
  <TRoute>(route: TRoute, queryParams?: string) =>
    fetch(`${baseUrl}/${route}${queryParams ? `?${queryParams}` : ''}`, {
      headers: { Authorization: `Bearer ${token}`, ...Object.fromEntries(headers) },
      next: { revalidate }
    });
