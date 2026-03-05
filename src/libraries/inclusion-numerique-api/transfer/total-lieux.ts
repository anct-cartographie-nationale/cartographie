type CollectiviteTerritoriale = {
  nombre_lieux: number;
};

const toTotalNombreLieux = (count: number, { nombre_lieux }: CollectiviteTerritoriale): number => count + nombre_lieux;

export const totalLieux = (collectivitesTerritoriales: CollectiviteTerritoriale[]): number =>
  collectivitesTerritoriales.reduce(toTotalNombreLieux, 0);
