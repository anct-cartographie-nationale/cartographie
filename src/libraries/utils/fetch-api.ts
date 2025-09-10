export const fetchApi =
  ({ baseUrl, revalidate, token }: { baseUrl: string; revalidate: number; token: string }) =>
  <TRoute>(route: TRoute, queryParams?: string) =>
    fetch(`${baseUrl}/${route}${queryParams ? `?${queryParams}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate }
    });
