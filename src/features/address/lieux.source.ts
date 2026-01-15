import { type Effect, tryPromise } from 'effect/Effect';
import type { Address } from './address';

type LieuSearchResult = {
  id: string;
  nom: string;
  adresse: {
    numero_voie: string;
    repetition: string;
    nom_voie: string;
    commune: string;
    code_postal: string;
    code_insee: string;
  };
};

const addressToString = (adresse: LieuSearchResult['adresse']): string =>
  `${[adresse.numero_voie, adresse.repetition].join('')} ${adresse.nom_voie}`.trim();

const lieuToAddress = (lieuSearchResult: LieuSearchResult): Address => ({
  id: lieuSearchResult.id,
  lieuId: lieuSearchResult.id,
  label: `${addressToString(lieuSearchResult.adresse)}, ${lieuSearchResult.adresse.code_insee} ${lieuSearchResult.adresse.commune}`,
  name: lieuSearchResult.nom,
  city: lieuSearchResult.adresse.commune,
  citycode: lieuSearchResult.adresse.code_insee,
  postcode: lieuSearchResult.adresse.code_postal,
  street: addressToString(lieuSearchResult.adresse)
});

export const fetchLieuxSuggestions = (input: string): Effect<Address[], Error> =>
  tryPromise({
    try: async () => {
      const res = await fetch(`/api/lieux/search?q=${encodeURIComponent(input)}`);
      if (!res.ok) throw new Error(res.statusText);
      const lieux: LieuSearchResult[] = await res.json();
      return lieux.map(lieuToAddress);
    },
    catch: (err) => new Error(`Lieux fetch failed: ${err}`)
  });
