import type { Territoire } from './territoire';

export type Vue = 'filtree' | 'centree';

export type IntegrationParams = {
  siteUrl: string;
  territoire: Territoire;
  vue: Vue;
};

const MATOMO_CAMPAIGN = 'integrationweb';
const COORDINATE_PRECISION = 4;

const compactSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

const roundCoordinate = (value: number): string => String(Number(value.toFixed(COORDINATE_PRECISION)));

export const matomoKeyword = ({ nom, type }: Territoire): string => `${compactSlug(nom)}${type}`;

export const withoutTrailingSlash = (url: string): string => url.replace(/\/+$/, '');

const positionParams = ({ localisation, zoom }: Territoire): string[] => [
  `latitude=${roundCoordinate(localisation.latitude)}`,
  `longitude=${roundCoordinate(localisation.longitude)}`,
  `zoom=${zoom}`
];

const territoireParams = ({ filtre }: Territoire): string[] => [
  `territoire_type=${filtre.type}`,
  `territoires=${filtre.codes.join(',')}`
];

const matomoParams = (territoire: Territoire): string[] => [
  `mtm_campaign=${MATOMO_CAMPAIGN}`,
  `mtm_kwd=${matomoKeyword(territoire)}`
];

export const buildIntegrationUrl = ({ siteUrl, territoire, vue }: IntegrationParams): string => {
  const params = [
    ...(vue === 'filtree' ? territoireParams(territoire) : []),
    ...positionParams(territoire),
    ...matomoParams(territoire)
  ];
  return `${withoutTrailingSlash(siteUrl)}${territoire.path}?${params.join('&')}`;
};
