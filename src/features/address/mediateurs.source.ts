import { type Effect, tryPromise } from 'effect/Effect';
import { API_BASE_URL, inject } from '@/libraries/injection';
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
    try: async () => {
      const res = await fetch(`${inject(API_BASE_URL)}/mediateurs/search?q=${encodeURIComponent(input)}`);
      if (!res.ok) throw new Error(res.statusText);
      const mediateurs: MediateurSearchResult[] = await res.json();
      return mediateurs.flatMap(lieuToAddress);
    },
    catch: (err) => new Error(`Mediateurs fetch failed: ${err}`)
  });
