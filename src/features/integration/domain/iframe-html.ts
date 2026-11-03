import { withIframeMode } from './integration-mode';
import { buildIntegrationUrl, type IntegrationParams } from './integration-url';

const IFRAME_HEIGHT = 800;

const escapeAttribute = (value: string): string => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const buildIframeHtml = (params: IntegrationParams): string => {
  const src = withIframeMode(buildIntegrationUrl(params));
  const title = `Cartographie des lieux d'inclusion numérique - ${params.territoire.nom}`;
  return `<iframe
  src="${escapeAttribute(src)}"
  title="${escapeAttribute(title)}"
  width="100%"
  height="${IFRAME_HEIGHT}"
  style="border: 0"
  loading="lazy"
  allow="geolocation"
></iframe>
`;
};
