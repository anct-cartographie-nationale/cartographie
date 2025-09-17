export const formatPhoneNumber = (telephone: string): string =>
  telephone
    .replace(/^\+33/, '0')
    .replace(/(\d{2})(?=\d)/g, '$1 ')
    .trim();
