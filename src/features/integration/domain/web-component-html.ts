import { type IntegrationParams, withoutTrailingSlash } from './integration-url';

export type WebComponentParams = IntegrationParams & {
  version: string;
  appName: string;
  logoUrl?: string | undefined;
  colorPrimary?: string | undefined;
  colorPrimaryContent?: string | undefined;
};

const PACKAGE_CDN = 'https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale';

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const attribute = (name: string, value: string | number | undefined): string | null =>
  value == null || value === '' ? null : `${name}="${escapeHtml(String(value))}"`;

const themeStyle = ({ colorPrimary, colorPrimaryContent }: WebComponentParams): string => {
  const variables = [
    colorPrimary && `        --color-primary: ${colorPrimary};`,
    colorPrimaryContent && `        --color-primary-content: ${colorPrimaryContent};`
  ].filter(Boolean);
  return variables.length === 0 ? '' : `\n    <style>\n      :root {\n${variables.join('\n')}\n      }\n    </style>`;
};

const attributes = ({ siteUrl, territoire, vue, appName, logoUrl }: WebComponentParams): string =>
  [
    attribute('api-url', `${withoutTrailingSlash(siteUrl)}/api`),
    attribute('app-name', appName),
    attribute('logo-url', logoUrl),
    attribute('latitude', territoire.localisation.latitude),
    attribute('longitude', territoire.localisation.longitude),
    attribute('zoom', territoire.zoom),
    ...(vue === 'filtree'
      ? [
          attribute('territoire-type', territoire.filtre.type),
          attribute('territoires', territoire.filtre.codes.join(',')),
          attribute('route-initiale', territoire.path)
        ]
      : [])
  ]
    .filter((line): line is string => line != null)
    .map((line) => `      ${line}`)
    .join('\n');

export const buildWebComponentHtml = (params: WebComponentParams): string => `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(params.appName)}</title>
    <link href="${PACKAGE_CDN}@${params.version}/dist-wc/cartographie-nationale.css" rel="stylesheet" />${themeStyle(params)}
  </head>
  <body style="height: 100vh; margin: 0">
    <cartographie-inclusion-numerique
${attributes(params)}
    />
    <script src="${PACKAGE_CDN}@${params.version}/dist-wc/cartographie.umd.js"></script>
  </body>
</html>
`;
