export const hrefWithSearchParams =
  (href: string = '') =>
  (searchParams?: URLSearchParams, exclude: string[] = []): string => {
    exclude.map((param) => searchParams?.delete(param));
    const paramsString = searchParams?.toString();
    return paramsString ? `${href}?${paramsString}` : href;
  };
