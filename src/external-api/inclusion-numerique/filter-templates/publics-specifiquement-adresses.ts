export const publicsSpecifiquementAdressesContainsFilter = (publicsSpecifiquementAdresses: string): string =>
  `publics_specifiquement_adresses.like.%${publicsSpecifiquementAdresses}%`;
