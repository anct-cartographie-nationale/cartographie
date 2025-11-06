import {
  DispositifProgrammeNational,
  FormationLabel,
  Frais,
  ModaliteAcces,
  ModaliteAccompagnement,
  PriseEnChargeSpecifique,
  PublicSpecifiquementAdresse,
  type SchemaLieuMediationNumerique,
  Service,
  Typologie
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { describe, expect, it } from 'vitest';
import { mediationNumeriqueToCsv } from './mediation-numerique.to-csv';

describe('output', (): void => {
  it('should convert empty schema de la médiation numérique data to CSV with headers only', (): void => {
    const csv: string = mediationNumeriqueToCsv([]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","typologie","telephone","courriels","site_web","horaires","presentation_resume","presentation_detail","source","itinerance","structure_parente","date_maj","services","publics_specifiquement_adresses","prise_en_charge_specifique","frais_a_charge","dispositif_programmes_nationaux","formations_labels","autres_formations_labels","modalites_acces","modalites_accompagnement","fiche_acces_libre","prise_rdv"\n'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and one line', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        fiche_acces_libre:
          'https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/',
        adresse: '12 BIS RUE DE LECLERCQ',
        code_insee: '51454',
        code_postal: '51100',
        commune: 'Reims',
        complement_adresse: "Le patio du bois de l'Aulne",
        frais_a_charge: [Frais.Payant, Frais.GratuitSousCondition].join('|'),
        courriels: ['contact@laquincaillerie.tl', 'hello@laquincaillerie.tl'].join('|'),
        date_maj: '2022-06-02',
        horaires: 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00',
        id: 'structure-1',
        dispositif_programmes_nationaux: [
          DispositifProgrammeNational.FranceServices,
          DispositifProgrammeNational.CertificationPIX,
          DispositifProgrammeNational.PointNumeriqueCAF
        ].join('|'),
        formations_labels: [FormationLabel.FormeAMonEspaceSante, FormationLabel.ArniaMednum].join('|'),
        autres_formations_labels: ['SudLabs', 'Nièvre médiation numérique'].join('|'),
        latitude: 43.52609,
        longitude: 5.41423,
        modalites_acces: [ModaliteAcces.ContacterParMail, ModaliteAcces.SePresenter].join('|'),
        modalites_accompagnement: [ModaliteAccompagnement.EnAutonomie, ModaliteAccompagnement.AccompagnementIndividuel].join(
          '|'
        ),
        nom: 'Anonymal',
        pivot: '43493312300029',
        presentation_detail:
          "Notre parcours d'initiation permet l'acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d'accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.",
        presentation_resume:
          'Notre association propose des formations aux outils numériques à destination des personnes âgées.',
        itinerance: ['Itinérant', 'Fixe'].join('|'),
        prise_rdv: 'https://www.rdv-solidarites.fr/',
        publics_specifiquement_adresses: [
          PublicSpecifiquementAdresse.FamillesEnfants,
          PublicSpecifiquementAdresse.Seniors
        ].join('|'),
        prise_en_charge_specifique: [PriseEnChargeSpecifique.Surdite, PriseEnChargeSpecifique.DeficienceVisuelle].join('|'),
        services: [
          Service.AideAuxDemarchesAdministratives,
          Service.MaitriseDesOutilsNumeriquesDuQuotidien,
          Service.AccesInternetEtMaterielInformatique
        ].join('|'),
        site_web: ['https://www.laquincaillerie.tl/', 'https://m.facebook.com/laquincaillerienumerique/'].join('|'),
        source: 'Hubik',
        structure_parente: 'Pôle emploi',
        telephone: '+33180059880',
        typologie: [Typologie.TIERS_LIEUX, Typologie.ASSO].join('|')
      }
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","typologie","telephone","courriels","site_web","horaires","presentation_resume","presentation_detail","source","itinerance","structure_parente","date_maj","services","publics_specifiquement_adresses","prise_en_charge_specifique","frais_a_charge","dispositif_programmes_nationaux","formations_labels","autres_formations_labels","modalites_acces","modalites_accompagnement","fiche_acces_libre","prise_rdv"\n' +
        '"structure-1","43493312300029","Anonymal","Reims","51100","51454","12 BIS RUE DE LECLERCQ","Le patio du bois de l\'Aulne","43.52609","5.41423","TIERS_LIEUX|ASSO","+33180059880","contact@laquincaillerie.tl|hello@laquincaillerie.tl","https://www.laquincaillerie.tl/|https://m.facebook.com/laquincaillerienumerique/","Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00","Notre association propose des formations aux outils numériques à destination des personnes âgées.","Notre parcours d\'initiation permet l\'acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d\'accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.","Hubik","Itinérant|Fixe","Pôle emploi","2022-06-02","Aide aux démarches administratives|Maîtrise des outils numériques du quotidien|Accès internet et matériel informatique","Familles et/ou enfants|Seniors","Surdité|Déficience visuelle","Payant|Gratuit sous condition","France Services|Certification PIX|Point d\'accès numérique CAF","Formé à « Mon Espace Santé »|Arnia/MedNum BFC (Bourgogne-Franche-Comté)","SudLabs|Nièvre médiation numérique","Contacter par mail|Se présenter","En autonomie|Accompagnement individuel","https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/","https://www.rdv-solidarites.fr/"'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and two lines', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        fiche_acces_libre:
          'https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/',
        adresse: '12 BIS RUE DE LECLERCQ',
        code_insee: '51454',
        code_postal: '51100',
        commune: 'Reims',
        complement_adresse: "Le patio du bois de l'Aulne",
        frais_a_charge: [Frais.Payant, Frais.GratuitSousCondition].join('|'),
        courriels: ['contact@laquincaillerie.tl', 'hello@laquincaillerie.tl'].join('|'),
        date_maj: '2022-06-02',
        horaires: 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00',
        id: 'structure-1',
        dispositif_programmes_nationaux: [
          DispositifProgrammeNational.FranceServices,
          DispositifProgrammeNational.CertificationPIX,
          DispositifProgrammeNational.PointNumeriqueCAF
        ].join('|'),
        formations_labels: [FormationLabel.FormeAMonEspaceSante, FormationLabel.ArniaMednum].join('|'),
        autres_formations_labels: ['SudLabs', 'Nièvre médiation numérique'].join('|'),
        latitude: 43.52609,
        longitude: 5.41423,
        modalites_acces: [ModaliteAcces.ContacterParMail, ModaliteAcces.SePresenter].join('|'),
        modalites_accompagnement: [ModaliteAccompagnement.EnAutonomie, ModaliteAccompagnement.AccompagnementIndividuel].join(
          '|'
        ),
        nom: 'Anonymal',
        pivot: '43493312300029',
        presentation_detail:
          "Notre parcours d'initiation permet l'acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d'accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.",
        presentation_resume:
          'Notre association propose des formations aux outils numériques à destination des personnes âgées.',
        itinerance: ['Itinérant', 'Fixe'].join('|'),
        prise_rdv: 'https://www.rdv-solidarites.fr/',
        publics_specifiquement_adresses: [
          PublicSpecifiquementAdresse.FamillesEnfants,
          PublicSpecifiquementAdresse.Seniors
        ].join('|'),
        prise_en_charge_specifique: [PriseEnChargeSpecifique.Surdite, PriseEnChargeSpecifique.DeficienceVisuelle].join('|'),
        services: [
          Service.AideAuxDemarchesAdministratives,
          Service.MaitriseDesOutilsNumeriquesDuQuotidien,
          Service.AccesInternetEtMaterielInformatique
        ].join('|'),
        site_web: ['https://www.laquincaillerie.tl/', 'https://m.facebook.com/laquincaillerienumerique/'].join('|'),
        source: 'Hubik',
        structure_parente: 'Pôle emploi',
        telephone: '+33180059880',
        typologie: [Typologie.TIERS_LIEUX, Typologie.ASSO].join('|')
      },
      {
        adresse: '51 rue de la république',
        code_postal: '75013',
        commune: 'Paris',
        date_maj: '2022-11-07',
        id: 'structure-2',
        nom: 'Médiation république',
        pivot: '43497452600012'
      }
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","typologie","telephone","courriels","site_web","horaires","presentation_resume","presentation_detail","source","itinerance","structure_parente","date_maj","services","publics_specifiquement_adresses","prise_en_charge_specifique","frais_a_charge","dispositif_programmes_nationaux","formations_labels","autres_formations_labels","modalites_acces","modalites_accompagnement","fiche_acces_libre","prise_rdv"\n' +
        '"structure-1","43493312300029","Anonymal","Reims","51100","51454","12 BIS RUE DE LECLERCQ","Le patio du bois de l\'Aulne","43.52609","5.41423","TIERS_LIEUX|ASSO","+33180059880","contact@laquincaillerie.tl|hello@laquincaillerie.tl","https://www.laquincaillerie.tl/|https://m.facebook.com/laquincaillerienumerique/","Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00","Notre association propose des formations aux outils numériques à destination des personnes âgées.","Notre parcours d\'initiation permet l\'acquisition de compétences numériques de base. Nous proposons également un accompagnement à destination des personnes déjà initiées qui souhaiteraient approfondir leurs connaissances. Du matériel informatique est en libre accès pour nos adhérents tous les après-midis. En plus de d\'accueillir les personnes dans notre lieu en semaine (sur rendez-vous), nous assurons une permanence le samedi matin dans la médiathèque XX.","Hubik","Itinérant|Fixe","Pôle emploi","2022-06-02","Aide aux démarches administratives|Maîtrise des outils numériques du quotidien|Accès internet et matériel informatique","Familles et/ou enfants|Seniors","Surdité|Déficience visuelle","Payant|Gratuit sous condition","France Services|Certification PIX|Point d\'accès numérique CAF","Formé à « Mon Espace Santé »|Arnia/MedNum BFC (Bourgogne-Franche-Comté)","SudLabs|Nièvre médiation numérique","Contacter par mail|Se présenter","En autonomie|Accompagnement individuel","https://acceslibre.beta.gouv.fr/app/29-lampaul-plouarzel/a/bibliotheque-mediatheque/erp/mediatheque-13/","https://www.rdv-solidarites.fr/"\n' +
        '"structure-2","43497452600012","Médiation république","Paris","75013",,"51 rue de la république",,,,,,,,,,,,,,"2022-11-07",,,,,,,,,,,'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and a name containing forbidden "', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        adresse: '51 rue de la république',
        code_postal: '75013',
        commune: 'Paris',
        date_maj: '2022-11-07',
        id: 'structure-2',
        nom: 'Médiation république "MRPP"',
        pivot: '43497452600012'
      }
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","typologie","telephone","courriels","site_web","horaires","presentation_resume","presentation_detail","source","itinerance","structure_parente","date_maj","services","publics_specifiquement_adresses","prise_en_charge_specifique","frais_a_charge","dispositif_programmes_nationaux","formations_labels","autres_formations_labels","modalites_acces","modalites_accompagnement","fiche_acces_libre","prise_rdv"\n' +
        '"structure-2","43497452600012","Médiation république MRPP","Paris","75013",,"51 rue de la république",,,,,,,,,,,,,,"2022-11-07",,,,,,,,,,,'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with extra field out of schema', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        adresse: '12 BIS RUE DE LECLERCQ',
        code_postal: '51100',
        commune: 'Reims',
        date_maj: '2022-06-02',
        id: 'structure-1',
        nom: 'Anonymal',
        pivot: '43493312300029'
      },
      {
        adresse: '51 rue de la république',
        code_postal: '75013',
        commune: 'Paris',
        date_maj: '2022-11-07',
        id: 'structure-2',
        nom: 'Médiation république',
        pivot: '43497452600012',
        extraField: 'extra'
      } as SchemaLieuMediationNumerique
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","typologie","telephone","courriels","site_web","horaires","presentation_resume","presentation_detail","source","itinerance","structure_parente","date_maj","services","publics_specifiquement_adresses","prise_en_charge_specifique","frais_a_charge","dispositif_programmes_nationaux","formations_labels","autres_formations_labels","modalites_acces","modalites_accompagnement","fiche_acces_libre","prise_rdv","extraField"\n' +
        '"structure-1","43493312300029","Anonymal","Reims","51100",,"12 BIS RUE DE LECLERCQ",,,,,,,,,,,,,,"2022-06-02",,,,,,,,,,,,""\n' +
        '"structure-2","43497452600012","Médiation république","Paris","75013",,"51 rue de la république",,,,,,,,,,,,,,"2022-11-07",,,,,,,,,,,,"extra"'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with complex extra field out of schema', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        adresse: '12 BIS RUE DE LECLERCQ',
        code_postal: '51100',
        commune: 'Reims',
        date_maj: '2022-06-02',
        id: 'structure-1',
        nom: 'Anonymal',
        pivot: '43493312300029'
      },
      {
        adresse: '51 rue de la république',
        code_postal: '75013',
        commune: 'Paris',
        date_maj: '2022-11-07',
        id: 'structure-2',
        nom: 'Médiation république',
        pivot: '43497452600012',
        extraField: {
          mediateurs: [
            {
              nom: 'John Doe',
              email: 'john@doe.com',
              phone: '+33123456789',
              labels: ['Label1', 'Label2']
            },
            {
              nom: 'Jane Smith',
              email: 'jane@smith.com',
              phone: '+33987654321',
              labels: ['Label3']
            }
          ]
        }
      } as SchemaLieuMediationNumerique
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","typologie","telephone","courriels","site_web","horaires","presentation_resume","presentation_detail","source","itinerance","structure_parente","date_maj","services","publics_specifiquement_adresses","prise_en_charge_specifique","frais_a_charge","dispositif_programmes_nationaux","formations_labels","autres_formations_labels","modalites_acces","modalites_accompagnement","fiche_acces_libre","prise_rdv","extraField"\n' +
        '"structure-1","43493312300029","Anonymal","Reims","51100",,"12 BIS RUE DE LECLERCQ",,,,,,,,,,,,,,"2022-06-02",,,,,,,,,,,,""\n' +
        '"structure-2","43497452600012","Médiation république","Paris","75013",,"51 rue de la république",,,,,,,,,,,,,,"2022-11-07",,,,,,,,,,,,"mediateurs : nom : John Doe, email : john@doe.com, phone : +33123456789, labels : Label1/Label2/nom : Jane Smith, email : jane@smith.com, phone : +33987654321, labels : Label3"'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and no offset cause of double quote', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        id: '36',
        nom: 'Pole Emploi Biarritz (permanence St Palais)',
        services: [
          Service.AccesInternetEtMaterielInformatique,
          Service.MaitriseDesOutilsNumeriquesDuQuotidien,
          Service.LoisirsEtCreationsNumeriques,
          Service.UtilisationSecuriseeDuNumerique,
          Service.InsertionProfessionnelleViaLeNumerique
        ].join('|'),
        pivot: '00000000000000',
        commune: 'Saint Palais',
        code_postal: '64120',
        adresse: 'Maison France Service " St Palais "',
        complement_adresse: 'Bâtiment " La Bobine créative "',
        latitude: 43.323496,
        longitude: -1.037223,
        courriels: 'ape.64062@pole-emploi.fr',
        site_web: 'https://www.pole-emploi.fr/',
        presentation_detail:
          '2 postes en libre acces avec imprimantes - scanners. Acces aux principaux sites de services publics.\nAteliers d\'utilisation de "pole-emploi.fr"\nPrescription de formation "HSP socle - les savoirs',
        publics_specifiquement_adresses: [PublicSpecifiquementAdresse.Jeunes, PublicSpecifiquementAdresse.Seniors].join('|'),
        frais_a_charge: [Frais.Gratuit].join('|'),
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        source: 'Fibre 64',
        date_maj: '1969-12-31',
        autres_formations_labels:
          'Structure relai du dispositif "Territoire Numérique Educatif" en partenariat avec les orKs-Grand Poitiers et la Trousse à Projets.'
      }
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","typologie","telephone","courriels","site_web","horaires","presentation_resume","presentation_detail","source","itinerance","structure_parente","date_maj","services","publics_specifiquement_adresses","prise_en_charge_specifique","frais_a_charge","dispositif_programmes_nationaux","formations_labels","autres_formations_labels","modalites_acces","modalites_accompagnement","fiche_acces_libre","prise_rdv"\n' +
        '"36","00000000000000","Pole Emploi Biarritz (permanence St Palais)","Saint Palais","64120",,"Maison France Service St Palais","Bâtiment La Bobine créative","43.323496","-1.037223",,,"ape.64062@pole-emploi.fr","https://www.pole-emploi.fr/",,,"2 postes en libre acces avec imprimantes - scanners. Acces aux principaux sites de services publics.Ateliers d\'utilisation de ＂pole-emploi.fr＂Prescription de formation ＂HSP socle - les savoirs","Fibre 64",,,"1969-12-31","Accès internet et matériel informatique|Maîtrise des outils numériques du quotidien|Loisirs et créations numériques|Utilisation sécurisée du numérique|Insertion professionnelle via le numérique","Jeunes|Seniors",,"Gratuit",,,"Structure relai du dispositif ＂Territoire Numérique Educatif＂ en partenariat avec les orKs-Grand Poitiers et la Trousse à Projets.",,"Avec de l\'aide : je suis accompagné seul dans l\'usage du numérique",,'
    );
  });

  it('should convert schema de la médiation numérique single data to CSV with headers and not offset in horraires field', (): void => {
    const csv: string = mediationNumeriqueToCsv([
      {
        id: '8fffbaf6-56e2-4501-958a-25dc56a572a4',
        nom: 'EMMAUS CONNECT FONDATEUR ABBE PIERRE',
        services: [Service.MaitriseDesOutilsNumeriquesDuQuotidien, Service.LoisirsEtCreationsNumeriques].join('|'),
        pivot: '79227291600042',
        typologie: 'ASSO',
        commune: 'Lille',
        code_postal: '59000',
        adresse: "83 Rue de l'Abbé Aerts",
        code_insee: '59350',
        latitude: 50.624933,
        longitude: 3.051349,
        telephone: '+33180059880',
        courriels: 'cslille@emmaus-connect.org',
        site_web: 'https://emmaus-connect.org/',
        presentation_resume: 'Faire du numérique une chance pour tous.',
        presentation_detail:
          'Emmaüs Connect agit depuis 2013 pour permettre aux personnes en situation de précarité sociale et numérique d’accéder aux outils en ligne devenus indispensables. Être coupé d’internet aujourd’hui, c’est être exclu de services essentiels de la vie quotidienne, c’est s’éloigner du retour à l’emploi, du lien social.<br><br>**L’association a la particularité de travailler sur les 3 aspects de la précarité numérique : l’accès au matériel, l’accès aux moyens de connexion et l’accompagnement vers des compétences essentielles.**A ce jour, plus de 135 000 personnes ont pu être aidées au sein de nos [lieux d’accueil](<https://emmaus-connect.org/nous-trouver/>) ou de Relais Numériques partenaires.L’association propose également des [formations et des outils](<https://emmaus-connect.org/formations-professionnels/>) aux acteurs sociaux et opérateurs de services publics pour transmettre ses méthodes avec l’ambition de changer d’échelle dans l’inclusion numérique sur tout le territoire.',
        frais_a_charge: [Frais.Gratuit].join('|'),
        modalites_accompagnement: "Avec de l'aide : je suis accompagné seul dans l'usage du numérique",
        dispositif_programmes_nationaux: [
          DispositifProgrammeNational.ConseillersNumeriques,
          DispositifProgrammeNational.CertificationPIX
        ].join('|'),
        horaires:
          'Tu 09:15-18:30;We 09:15-18:30;Th 09:15-18:30;Fr 09:15-18:30;Sa 09:15-12:30; "fermé au public les lundis, horaires variables"',
        source: 'dora',
        date_maj: '2023-06-22'
      }
    ]);

    expect(csv).toBe(
      '"id","pivot","nom","commune","code_postal","code_insee","adresse","complement_adresse","latitude","longitude","typologie","telephone","courriels","site_web","horaires","presentation_resume","presentation_detail","source","itinerance","structure_parente","date_maj","services","publics_specifiquement_adresses","prise_en_charge_specifique","frais_a_charge","dispositif_programmes_nationaux","formations_labels","autres_formations_labels","modalites_acces","modalites_accompagnement","fiche_acces_libre","prise_rdv"\n' +
        '"8fffbaf6-56e2-4501-958a-25dc56a572a4","79227291600042","EMMAUS CONNECT FONDATEUR ABBE PIERRE","Lille","59000","59350","83 Rue de l\'Abbé Aerts",,"50.624933","3.051349","ASSO","+33180059880","cslille@emmaus-connect.org","https://emmaus-connect.org/","Tu 09:15-18:30;We 09:15-18:30;Th 09:15-18:30;Fr 09:15-18:30;Sa 09:15-12:30; fermé au public les lundis, horaires variables","Faire du numérique une chance pour tous.","Emmaüs Connect agit depuis 2013 pour permettre aux personnes en situation de précarité sociale et numérique d’accéder aux outils en ligne devenus indispensables. Être coupé d’internet aujourd’hui, c’est être exclu de services essentiels de la vie quotidienne, c’est s’éloigner du retour à l’emploi, du lien social.<br><br>**L’association a la particularité de travailler sur les 3 aspects de la précarité numérique : l’accès au matériel, l’accès aux moyens de connexion et l’accompagnement vers des compétences essentielles.**A ce jour, plus de 135 000 personnes ont pu être aidées au sein de nos [lieux d’accueil](<https://emmaus-connect.org/nous-trouver/>) ou de Relais Numériques partenaires.L’association propose également des [formations et des outils](<https://emmaus-connect.org/formations-professionnels/>) aux acteurs sociaux et opérateurs de services publics pour transmettre ses méthodes avec l’ambition de changer d’échelle dans l’inclusion numérique sur tout le territoire.","dora",,,"2023-06-22","Maîtrise des outils numériques du quotidien|Loisirs et créations numériques",,,"Gratuit","Conseillers numériques|Certification PIX",,,,"Avec de l\'aide : je suis accompagné seul dans l\'usage du numérique",,'
    );
  });
});
