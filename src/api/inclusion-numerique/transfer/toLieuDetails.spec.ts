import { describe, expect, it } from 'vitest';
import type { LieuDetails } from '@/features/lieux-inclusion-numerique/lieu-details';
import type { LieuxRouteResponse } from '../routes';
import { toLieuDetails } from './toLieuDetails';

describe('to lieu details', () => {
  it('should transform minimal lieu to lieu details', () => {
    const lieu: LieuxRouteResponse[number] & { region: string; departement: string } = {
      id: '1',
      nom: 'Lieu 1',
      adresse: '123 Rue Principale',
      commune: 'Paris',
      code_postal: '75001',
      code_insee: '75000',
      departement: '75',
      region: 'Île-de-France',
      services: ['Aide aux démarches administratives'].join('|')
    };

    const lieuDetails: LieuDetails = toLieuDetails(lieu);

    expect(lieuDetails).toEqual({
      id: '1',
      nom: 'Lieu 1',
      adresse: '123 Rue Principale, 75001 Paris',
      departement: '75',
      region: 'Île-de-France',
      isFranceServices: false,
      isConum: false,
      labels: [],
      services: {
        competences: ['Aide aux démarches administratives'],
        cultureNumerique: [],
        materielInformatique: []
      },
      typesAccompagnement: [],
      publicsSpecifiques: [],
      fraisACharge: [],
      prisesEnChargeSpecifiques: [],
      modalitesAcces: [],
      mediateurs: []
    });
  });

  it('should transform maximal lieu to lieu details', () => {
    const lieu: LieuxRouteResponse[number] & { region: string; departement: string } = {
      id: '1',
      nom: 'Lieu 1',
      commune: 'Paris',
      code_postal: '75001',
      code_insee: '75000',
      adresse: '123 Rue Principale',
      complement_adresse: 'bâtiment 3',
      departement: '75',
      region: 'Île-de-France',
      latitude: 48.8526,
      longitude: 2.3509,
      telephone: '+33612823657',
      courriels: 'contact@maisondelamarianne.fr',
      site_web: 'https://maisondelamarianne.fr/france-services-valdoie/',
      horaires: 'Mo-Fr 09:00-12:00,13:30-17:30; Tu 10:00-12:30,13:30-17:30',
      presentation_resume: 'Accompagnement à l’utilisation des outils numériques par les agriculteurs',
      presentation_detail:
        'L’Atelier Numérique est un espace de médiation et de ressource numérique labellisé « Espace Public Numérique ». Sesdomaines d’intervention sont la médiation numérique, l’insertion socio-professionnelle, l’Education aux Médias et àl’Information. Nous accompagnons les habitants de tout âge à la découverte et l’utilisation des outils numérique, via desaccès libres Mus in sagittis pellentesque auctor in. Quam vel purus fames est accumsan vel id ipsum dolor. Rutrum egestasin elementum platea erat pellentesque id ut at. Duis tincidunt bibendum diam proin. Velit feugiat cursus nisi neque siteget. Volutpat massa commodo eu quam pulvinar. Nulla dolor diam sem proin in purus bibendum orci pretium. Magna et turpisgravida ultrices hendrerit pellentesque lobortis bibendum lacus. Id nisl odio magna commodo massa amet massa. Ut a enimsodales id commodo massa nec. Mattis non integer quis libero lectus diam. Sit dolor suspendisse consectetur lobortis namvitae. Dictum purus lectus vel blandit duis molestie ac vulputate. Nunc molestie iaculis parturient commodo consequatdolor rhoncus lectus. Arcu odio morbi felis senectus dolor eu in',
      services: [
        'Aide aux démarches administratives',
        'Maîtrise des outils numériques du quotidien',
        'Insertion professionnelle via le numérique',
        'Utilisation sécurisée du numérique',
        'Parentalité et éducation avec le numérique',
        'Loisirs et créations numériques',
        'Compréhension du monde numérique',
        'Accès internet et matériel informatique',
        'Acquisition de matériel informatique à prix solidaire'
      ].join('|'),
      publics_specifiquement_adresses: ['Jeunes', 'Étudiants', 'Familles et/ou enfants', 'Seniors', 'Femmes'].join('|'),
      prise_en_charge_specifique: [
        'Surdité',
        'Handicaps moteurs',
        'Handicaps mentaux',
        'Illettrisme',
        'Langues étrangères (anglais)',
        'Langues étrangères (autres)',
        'Déficience visuelle'
      ].join('|'),
      frais_a_charge: ['Gratuit', 'Gratuit sous condition', 'Payant'].join('|'),
      dispositif_programmes_nationaux: ['France Services', 'Conseillers numériques'].join('|'),
      formations_labels: ['Fabriques de Territoire', 'Formé à « Mon Espace Santé »'].join('|'),
      autres_formations_labels: ['QPV', 'ZRR'].join('|'),
      modalites_acces: [
        'Se présenter',
        'Téléphoner',
        'Contacter par mail',
        'Prendre un RDV en ligne',
        'Envoyer un mail avec une fiche de prescription'
      ].join('|'),
      modalites_accompagnement: ['Accompagnement individuel', 'Dans un atelier collectif', 'En autonomie', 'À distance'].join(
        '|'
      ),
      fiche_acces_libre: 'https://www.accessibilite.gouv.fr',
      prise_rdv: 'https://maisondelamarianne.fr/france-services-valdoie/rdv/',
      mediateurs: [
        {
          nom: 'Bruno Desmarais',
          labels: ['Conseiller Numérique', 'Aidants Connect'],
          email: 'nomprenom@mail.com',
          phone: '06 12 34 56 78'
        },
        {
          nom: 'Sofia Ben Youssef-Dubois',
          labels: ['Aidants Connect'],
          email: 'nomprenom@mail.com',
          phone: '06 98 76 54 32'
        },
        {
          nom: 'Lucie Marchand',
          labels: ['Conseiller Numérique']
        },
        { nom: 'Yassine Trabelsi', labels: [] },
        { nom: 'Claire Martin', labels: [] },
        { nom: 'Théo Moreau', labels: [] },
        { nom: 'Omar Gharbi', labels: [] }
      ]
    };

    const lieuDetails: LieuDetails = toLieuDetails(lieu);

    expect(lieuDetails).toEqual({
      id: '1',
      nom: 'Lieu 1',
      osmOpeningHours: 'Mo-Fr 09:00-12:00,13:30-17:30; Tu 10:00-12:30,13:30-17:30',
      isFranceServices: true,
      isConum: true,
      latitude: 48.8526,
      longitude: 2.3509,
      adresse: '123 Rue Principale (bâtiment 3), 75001 Paris',
      region: 'Île-de-France',
      departement: '75',
      siteInternet: 'https://maisondelamarianne.fr/france-services-valdoie/',
      accessibilite: 'https://www.accessibilite.gouv.fr',
      telephone: '+33612823657',
      courriel: 'contact@maisondelamarianne.fr',
      priseRDV: 'https://maisondelamarianne.fr/france-services-valdoie/rdv/',
      description:
        'L’Atelier Numérique est un espace de médiation et de ressource numérique labellisé « Espace Public Numérique ». Sesdomaines d’intervention sont la médiation numérique, l’insertion socio-professionnelle, l’Education aux Médias et àl’Information. Nous accompagnons les habitants de tout âge à la découverte et l’utilisation des outils numérique, via desaccès libres Mus in sagittis pellentesque auctor in. Quam vel purus fames est accumsan vel id ipsum dolor. Rutrum egestasin elementum platea erat pellentesque id ut at. Duis tincidunt bibendum diam proin. Velit feugiat cursus nisi neque siteget. Volutpat massa commodo eu quam pulvinar. Nulla dolor diam sem proin in purus bibendum orci pretium. Magna et turpisgravida ultrices hendrerit pellentesque lobortis bibendum lacus. Id nisl odio magna commodo massa amet massa. Ut a enimsodales id commodo massa nec. Mattis non integer quis libero lectus diam. Sit dolor suspendisse consectetur lobortis namvitae. Dictum purus lectus vel blandit duis molestie ac vulputate. Nunc molestie iaculis parturient commodo consequatdolor rhoncus lectus. Arcu odio morbi felis senectus dolor eu in',
      labels: ['Fabriques de Territoire', 'Formé à « Mon Espace Santé »', 'QPV', 'ZRR'],
      services: {
        competences: [
          'Aide aux démarches administratives',
          'Maîtrise des outils numériques du quotidien',
          'Insertion professionnelle via le numérique',
          'Utilisation sécurisée du numérique',
          'Parentalité et éducation avec le numérique'
        ],
        cultureNumerique: ['Loisirs et créations numériques', 'Compréhension du monde numérique'],
        materielInformatique: [
          'Accès internet et matériel informatique',
          'Acquisition de matériel informatique à prix solidaire'
        ]
      },
      typesAccompagnement: ['Accompagnement individuel', 'Dans un atelier collectif', 'En autonomie', 'À distance'],
      publicsSpecifiques: ['Jeunes', 'Étudiants', 'Familles et/ou enfants', 'Seniors', 'Femmes'],
      fraisACharge: ['Gratuit', 'Gratuit sous condition', 'Payant'],
      prisesEnChargeSpecifiques: [
        'Surdité',
        'Handicaps moteurs',
        'Handicaps mentaux',
        'Illettrisme',
        'Langues étrangères (anglais)',
        'Langues étrangères (autres)',
        'Déficience visuelle'
      ],
      modalitesAcces: [
        'Se présenter',
        'Téléphoner',
        'Contacter par mail',
        'Prendre un RDV en ligne',
        'Envoyer un mail avec une fiche de prescription'
      ],
      mediateurs: [
        {
          nom: 'Bruno Desmarais',
          labels: ['Conseiller Numérique', 'Aidants Connect'],
          email: 'nomprenom@mail.com',
          phone: '06 12 34 56 78'
        },
        {
          nom: 'Sofia Ben Youssef-Dubois',
          labels: ['Aidants Connect'],
          email: 'nomprenom@mail.com',
          phone: '06 98 76 54 32'
        },
        {
          nom: 'Lucie Marchand',
          labels: ['Conseiller Numérique']
        },
        { nom: 'Yassine Trabelsi', labels: [] },
        { nom: 'Claire Martin', labels: [] },
        { nom: 'Théo Moreau', labels: [] },
        { nom: 'Omar Gharbi', labels: [] }
      ]
    });
  });

  it('should transform lieu to lieu details with presentation_resume as description', () => {
    const lieu: LieuxRouteResponse[number] & { region: string; departement: string } = {
      id: '1',
      nom: 'Lieu 1',
      adresse: '123 Rue Principale',
      commune: 'Paris',
      code_postal: '75001',
      code_insee: '75000',
      departement: '75',
      region: 'Île-de-France',
      services: ['Aide aux démarches administratives'].join('|'),
      presentation_resume: 'Accompagnement à l’utilisation des outils numériques par les agriculteurs'
    };

    const lieuDetails: LieuDetails = toLieuDetails(lieu);

    expect(lieuDetails).toEqual({
      id: '1',
      nom: 'Lieu 1',
      adresse: '123 Rue Principale, 75001 Paris',
      departement: '75',
      region: 'Île-de-France',
      isFranceServices: false,
      isConum: false,
      description: 'Accompagnement à l’utilisation des outils numériques par les agriculteurs',
      labels: [],
      services: {
        competences: ['Aide aux démarches administratives'],
        cultureNumerique: [],
        materielInformatique: []
      },
      typesAccompagnement: [],
      publicsSpecifiques: [],
      fraisACharge: [],
      prisesEnChargeSpecifiques: [],
      modalitesAcces: [],
      mediateurs: []
    });
  });
});
