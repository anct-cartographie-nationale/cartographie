export const splitHref = (href: string): { to: string; search: Record<string, string> } => {
  const [to = '', query] = href.split('?');
  return { to, search: Object.fromEntries(new URLSearchParams(query)) };
};
