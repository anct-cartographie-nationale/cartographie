type CollectiviteTerritoriale = {
  code: string;
  nombre_lieux: number;
};

const matchingCode =
  (collectivite: { code: string }) =>
  ({ code }: { code: string }): boolean =>
    code === collectivite.code;

const withNombreLieuxFrom =
  <T extends { code: string }>(collectivitesTerritoriales: CollectiviteTerritoriale[]) =>
  (collectiviteTerritoriale: T): T & { nombreLieux: number } => ({
    ...collectiviteTerritoriale,
    nombreLieux: collectivitesTerritoriales.find(matchingCode(collectiviteTerritoriale))?.nombre_lieux ?? 0
  });

export const addNombreLieux =
  <T extends { code: string }>(collectivitesTerritoriales: CollectiviteTerritoriale[]) =>
  (collectivites: T[]): (T & { nombreLieux: number })[] =>
    collectivites.map(withNombreLieuxFrom(collectivitesTerritoriales));
