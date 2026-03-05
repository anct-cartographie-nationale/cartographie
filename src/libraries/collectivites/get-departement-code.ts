export const getDepartementCodeFromInsee = (codeInsee: string): string =>
  codeInsee.startsWith('97') ? codeInsee.substring(0, 3) : codeInsee.substring(0, 2);
