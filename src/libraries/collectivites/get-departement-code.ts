/**
 * Extrait le code département à partir d'un code INSEE de commune.
 * Gère les DOM-TOM (codes commençant par 97) qui ont des codes département à 3 chiffres.
 *
 * @example
 * getDepartementCodeFromInsee('75001') // '75'
 * getDepartementCodeFromInsee('97105') // '971'
 */
export const getDepartementCodeFromInsee = (codeInsee: string): string =>
  codeInsee.startsWith('97') ? codeInsee.substring(0, 3) : codeInsee.substring(0, 2);
