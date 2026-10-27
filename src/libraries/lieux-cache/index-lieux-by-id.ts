import type { LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';

type Lieu = LieuxRouteResponse[number];

/**
 * Index des lieux resolvable par DEUX clefs.
 *
 * `api.carto.id` est l'identifiant du registre depuis la migration V188 de
 * l'entrepot (ADR-003) ; il etait auparavant l'identifiant mednum. Comme le
 * segment d'URL `/<region>/<departement>/lieux/<id>` est cette valeur, les URL
 * deja partagees, mises en favori ou indexees portent l'ancien identifiant.
 *
 * On indexe donc les deux : l'identifiant du registre, qui est la forme
 * canonique, et `id_cartographie_nationale` quand il existe, qui garde les URL
 * heritees fonctionnelles. C'est le point 4 de l'ADR — un lieu reste
 * accessible par son identifiant mednum.
 *
 * La colonne `id_cartographie_nationale` est optionnelle a dessein : avant
 * V188 l'API ne la sert pas, et ce code se comporte alors exactement comme
 * avant, avec une seule clef par lieu.
 *
 * Les lieux Coop que mednum n'a jamais references n'ont aucun identifiant
 * mednum — ils sont 709 a entrer sur la carte avec V188 — et n'existent donc
 * que sous leur identifiant de registre.
 */
export const indexLieuxById = (lieux: LieuxRouteResponse): Map<string, Lieu> => {
  const index = new Map<string, Lieu>(lieux.map((lieu: Lieu): [string, Lieu] => [lieu.id, lieu]));

  // Second passage, et non un seul : la forme canonique est posee d'abord,
  // pour qu'un alias herite ne puisse jamais ecraser un identifiant de
  // registre qui lui serait identique.
  lieux.forEach((lieu: Lieu): void => {
    const herite = lieu.id_cartographie_nationale;
    if (herite != null && herite !== '' && !index.has(herite)) index.set(herite, lieu);
  });

  return index;
};
