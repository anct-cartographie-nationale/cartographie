import { type Effect, tryPromise } from 'effect/Effect';
import type { Address } from './address';

type Lieu = {
  id: string;
  nom: string;
  commune: string;
  code_postal: string;
  code_insee: string;
  adresse: string;
};

type MediateurSearchResult = {
  prenom: string;
  nom: string;
  lieux: Lieu[];
};

const lieuToAddress = (lieuSearchResult: MediateurSearchResult): Address[] =>
  lieuSearchResult.lieux.map((lieu) => ({
    id: `${lieuSearchResult.prenom}-${lieuSearchResult.nom}-${lieu.id}`,
    lieuId: lieu.id,
    label: `${lieu.adresse}, ${lieu.code_postal} ${lieu.commune}`,
    name: `${lieuSearchResult.prenom} ${lieuSearchResult.nom} - ${lieu.nom}`,
    city: lieu.commune,
    citycode: lieu.code_insee,
    postcode: lieu.code_postal,
    street: lieu.adresse
  }));

export const fetchMediateursSuggestions = (input: string): Effect<Address[], Error> =>
  tryPromise({
    try: () =>
      fetch(`/api/mediateurs/search?q=${encodeURIComponent(input)}`)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<MediateurSearchResult[]>;
        })
        .then((lieux) => lieux.flatMap(lieuToAddress)),
    catch: (err) => new Error(`Lieux fetch failed: ${err}`)
  });
