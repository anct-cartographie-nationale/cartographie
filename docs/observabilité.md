# Observabilité : capture d'erreurs (Sentry) et logs structurés (pino)

Ce document décrit l'observabilité de la Cartographie : la capture d'erreurs (Sentry), les logs structurés serveur (pino → Grafana), ce qui est capté, comment c'est câblé, et la configuration nécessaire en production.

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Couverture](#couverture)
- [Configuration requise](#configuration-requise)
- [⚠️ Ne pas lancer le wizard Sentry](#️-ne-pas-lancer-le-wizard-sentry)
- [Vérification locale (Bugsink)](#vérification-locale-bugsink)
- [Logs structurés serveur](#logs-structurés-serveur)
- [Limitations assumées](#limitations-assumées)

---

## Vue d'ensemble

Le reporting passe par `@sentry/nextjs`, abstrait derrière `@arckit/telemetry` (reporter vendor-agnostic). Tout le câblage applicatif est dans `src/configuration/telemetry/error-reporter/` :

| Fichier             | Rôle                                                                                                |
|---------------------|-----------------------------------------------------------------------------------------------------|
| `report-error.ts`   | `errorReporter = createSentryReporter()` (isomorphe, client + serveur)                              |
| `sentry-options.ts` | base partagée de `Sentry.init` : `tracesSampleRate`, `sendDefaultPii`, `environment`, `beforeSend`  |
| `client.ts`         | `register()` navigateur + `ignoreErrors` / `denyUrls` (bruit)                                       |
| `server.ts`         | `register()` serveur + `onRequestError`, `withErrorReporter` (actions), `withErrorHandler` (routes) |
| `scrub-event.ts`    | fonction pure : caviarde les emails avant envoi (PII)                                               |
| `index.ts`          | ré-export de `errorReporter` (consommé par les error boundaries)                                    |

`Sentry.init` est **gardé par `NEXT_PUBLIC_SENTRY_DSN`** : sans DSN, l'init est court-circuitée et aucun event n'est émis (no-op propre en local/CI).

L'enregistrement se fait via les points d'entrée Next.js :
- `src/instrumentation.ts` → `register()` serveur + export `onRequestError`
- `src/instrumentation-client.ts` → `register()` navigateur + `onRouterTransitionStart`

## Couverture

| Surface                                                       | Mécanisme                                         |
|---------------------------------------------------------------|---------------------------------------------------|
| Serveur non rattrapé (RSC, route handlers, actions qui throw) | `onRequestError`                                  |
| Routes d'export CSV (corps du handler converti en Response)   | `withErrorHandler` (`createWithErrorHandler`)     |
| Action serveur contact (avalée par `actionBuilder`)           | `withErrorReporter`                               |
| Rendu client (React)                                          | `error.tsx` + `global-error.tsx`                  |
| Client non rattrapé (`onerror` / `unhandledrejection`)        | handlers globaux Sentry (auto)                    |
| Transitions de navigation                                     | `onRouterTransitionStart`                         |
| Fetch chunk carte (client)                                    | `inject(ERROR_REPORTER).captureMessage`           |
| Rafraîchissement cache en arrière-plan (`/api/cache/reset`)   | `invalidateCache(onError)` → reporter au boundary |

Les emails sont caviardés avant envoi (`beforeSend: scrubEvent`) ; `sendDefaultPii: false` retire cookies/headers/IP.

## Configuration requise

Sans ces valeurs, **Sentry reste sur l'écran « Get Started » (zéro event)**. Aucune ligne de code à écrire — uniquement de la configuration.

### 1. Récupérer le DSN

Sentry → projet `cartographie` → **Settings → Client Keys (DSN)** (chemin direct : `/settings/sentry/projects/cartographie/keys/`). Le DSN a la forme `https://<clé-publique>@<hôte>/<id-projet>` — sur l'instance interne, par ex. `https://…@sentry.incubateur.anct.gouv.fr/45`.

### 2. GitHub → Settings → Secrets and variables → Actions

| Nom                              | Type       | Valeur                                                                         |
|----------------------------------|------------|--------------------------------------------------------------------------------|
| `NEXT_PUBLIC_SENTRY_DSN`         | Variable   | le DSN (public, exposé côté client)                                            |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Variable   | `production` (ou `preprod`)                                                    |
| `SENTRY_ORG`                     | Variable   | `sentry`                                                                       |
| `SENTRY_PROJECT`                 | Variable   | `cartographie`                                                                 |
| `SENTRY_URL`                     | Variable   | URL de l'instance auto-hébergée (ex. `https://sentry.incubateur.anct.gouv.fr`) |
| `SENTRY_AUTH_TOKEN`              | **Secret** | token Sentry, scopes `project:releases` + lecture org → source maps + releases |

Ces valeurs sont injectées au build par `.github/workflows/deploy.yml` (étape `Create env file` pour les `NEXT_PUBLIC_*`, env de l'étape `Build` pour les creds Sentry). Les `NEXT_PUBLIC_*` sont **inlinés au build** : ils doivent donc être présents au moment du `pnpm build`, pas seulement au runtime.

> **Instance auto-hébergée.** Le projet utilise un Sentry auto-hébergé, pas `sentry.io`. Le **DSN** encode déjà l'hôte → les events runtime partent au bon endroit automatiquement. En revanche l'**upload des source maps au build** (`withSentryConfig` / sentry-cli) vise `sentry.io` par défaut : `SENTRY_URL` est donc **obligatoire** pour qu'il pointe vers l'instance interne, sinon l'étape d'upload échoue.

### 3. Variables d'environnement (référence)

Voir `.env.example`. Côté Sentry :
- `NEXT_PUBLIC_SENTRY_DSN` — active la capture (client + serveur)
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT` — tag `environment` (triage prod/preprod)
- `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` — upload des source maps + création de release (build uniquement)

## ⚠️ Ne pas lancer le wizard Sentry

`npx @sentry/wizard@latest -i nextjs` est conçu pour un projet **sans** SDK. Le nôtre est déjà intégré, et plus proprement (instrumentation custom, init gardé par DSN, reporter abstrait). Lancer le wizard créerait des fichiers concurrents (`sentry.client.config.ts`, etc.) et casserait cette architecture. **Il ne manque que les valeurs de configuration ci-dessus.**

## Vérification locale (Bugsink)

`docker-compose.yml` fournit un service [Bugsink](https://www.bugsink.com/) (compatible protocole Sentry, conteneur unique, SQLite, éphémère) pour vérifier la capture de bout en bout sans toucher au projet Sentry de prod. Pointer `NEXT_PUBLIC_SENTRY_DSN` du `.env` local vers le DSN Bugsink, puis déclencher une erreur.

## Logs structurés serveur

En complément de Sentry (erreurs), les requêtes serveur émettent des **logs structurés JSON** via le pilier `logger` de `@arckit/telemetry` (pino). Scaleway Serverless Containers collecte automatiquement **stdout/stderr → Cockpit (Loki)**, consultable dans le Grafana intégré (LogQL), 7 jours de rétention, sans agent.

Câblage dans `src/configuration/telemetry/logger/server.ts` (**server-only**, runtime Node) :

| Export             | Rôle                                                                      |
|--------------------|---------------------------------------------------------------------------|
| `logger`           | `createPinoLogger({ getScope, getIdentity, getTrace })` — JSON sur stdout |
| `withLogger`       | `createWithLogger(logger)` — enveloppe un handler de **route**            |
| `withActionLogger` | `withLogger(logger)` (pilier action) — middleware de **server action**    |

Le logger enveloppe le handler ; pour les routes d'export il passe **par-dessus** `withErrorHandler` afin de capter le statut final mappé :

```ts
// route simple
.handle(withLogger('api:lieux')(async ({ lieux }) => Response.json(lieux)));
// route d'export (logger au-dessus de l'error handler)
.handle(withLogger('api:lieux:export')(withErrorHandler(MAP, MSG)(async ({ lieux }) => csvStreamResponse(...))));
// server action
.use(withActionLogger('action:contact:send'))
```

**Forme des logs** : `event` = `<nom>:success` (retour) ou `<nom>:failure` (exception, puis rethrow → reste capté par `onRequestError`). Attributs : `method`, `path`, `status`, `durationMs` (+ `error.type` sur échec). Émission **différée** via `after()` (réponse non bloquante).

**Couverture** : 19 des 21 routes + l'action contact. **Exclusions assumées** : `api/health` (sondée en continu par le monitoring → bruit) et `api/fragilite-numerique/[...params]` (handler Next brut hors `routeBuilder` + proxy de tuiles très fréquent).

**Requêtes LogQL utiles** (Grafana → Explore) :

```logql
{service="cartographie"} | json | status >= 500
{service="cartographie"} | json | durationMs > 1000
{service="cartographie"} | json | event = "api:lieux:export:failure"
```

> Les `console.*` restants sont du code **navigateur** (`geolocate.tsx`, web-component) — non collectés par Scaleway (seul le stdout serveur l'est) et hors pino (Node-only).

## Limitations assumées

Arbitrages conscients, à lever si le besoin apparaît :

- **Pas de tunnel Sentry** (`tunnelRoute`) → les events sont envoyés **directement** au host du DSN. Le tunnel (proxy via `/monitoring` pour contourner les bloqueurs) est **incompatible avec notre déploiement `output: 'standalone'`** : la route auto-générée n'est pas tracée dans le bundle standalone, donc `/monitoring` renvoyait le HTML de l'app et les events étaient perdus. Comme l'instance est sur un domaine gouv custom (absent des listes Pi-hole/uBlock, qui ciblent `sentry.io`), l'envoi direct est fiable. Ne pas réintroduire `tunnelRoute` sans vérifier que la route est servie en prod.
- **Pas de tracing distribué** (`tracesSampleRate: 0`) → les erreurs n'ont pas de trace liée. Le reporter supporte déjà `getTrace` ; il suffirait d'un petit taux + câbler le getter pour la corrélation erreur↔trace à travers l'API ANCT.
- **Web-component sans reporting** — le build embarquable utilise `createNoopReporter()` pour garder Sentry hors du bundle. Les erreurs dans `<cartographie-inclusion-numerique>` sont invisibles. Option si besoin : beacon léger vers un endpoint de report.
- **Pas de Session Replay** — choix de simplicité / vie privée pour une carte publique.
