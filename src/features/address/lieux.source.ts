import { type Effect, tryPromise } from 'effect/Effect';
import type { Address } from './address';

type LieuSearchResult = {
  id: string;
  nom: string;
  commune: string;
  code_postal: string;
  code_insee: string;
  adresse: string;
  latitude: number;
  longitude: number;
};

const lieuToAddress = (lieuSearchResult: LieuSearchResult): Address => ({
  id: lieuSearchResult.id,
  label: `${lieuSearchResult.adresse}, ${lieuSearchResult.code_postal} ${lieuSearchResult.commune}`,
  name: lieuSearchResult.nom,
  city: lieuSearchResult.commune,
  citycode: lieuSearchResult.code_insee,
  postcode: lieuSearchResult.code_postal,
  street: lieuSearchResult.adresse,
  x: lieuSearchResult.latitude,
  y: lieuSearchResult.longitude
});

export const fetchLieuxSuggestions = (input: string): Effect<Address[], Error> =>
  tryPromise({
    try: () =>
      fetch(`/api/lieux/search?q=${encodeURIComponent(input)}`)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<LieuSearchResult[]>;
        })
        .then((lieux) => lieux.map(lieuToAddress)),
    catch: (err) => new Error(`Lieux fetch failed: ${err}`)
  });
