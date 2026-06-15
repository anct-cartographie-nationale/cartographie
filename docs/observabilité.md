# Observabilité : erreurs (Sentry) et logs JSON (nginx + pino)

Ce document décrit l'observabilité de la Cartographie : la capture d'erreurs (Sentry), les logs JSON (nginx en couche edge, pino pour les événements applicatifs) collectés par Grafana, ce qui est capté, comment c'est câblé, et la configuration nécessaire en production.

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

En complément de Sentry (erreurs), les logs reposent sur **deux couches distinctes**, toutes deux en **JSON sur stdout** → collectées automatiquement par Scaleway Cockpit (Loki), requêtables dans le Grafana intégré avec `| json`, 7 jours de rétention, sans agent :

| Couche          | Source                            | Couvre                                                                                                                                  | Pour                                                                          |
|-----------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **Edge**        | nginx (`access_log` JSON)         | **toutes** les requêtes (pages, statiques, 403, API) : `status`/`method`/`path`/`request_time`/`upstream_time`/`country`/`cache_status` | **source unique des logs de requêtes** : trafic, erreurs, latence, géo, cache |
| **Application** | pino (`@arckit/telemetry/logger`) | événements applicatifs **invisibles côté edge** (ex. résultat d'une server action)                                                      | alerting métier                                                               |

> **Pas de log de requête au niveau applicatif.** nginx logge déjà chaque requête (statut, durée *app* via `upstream_time`, etc.) ; le dupliquer côté app (un `withLogger` par route) n'apporterait rien tant qu'on n'a ni tracing ni identité → c'est **nginx la source des logs de requêtes**. Le `logger` pino est réservé aux signaux que l'edge ne voit pas. Sentry reste la source des **erreurs** (stack/contexte).

### Couche edge — nginx

`infrastructure/nginx/nginx.conf` : `log_format main escape=json` → `access_log /dev/stdout main if=$loggable`. Le `map $loggable` exclut `/api/health` du stdout (sondé en continu = bruit). ⚠️ Le second `access_log … combined` (fichier) alimente **CrowdSec** — ne pas le modifier.

### Couche application — pino

Câblage dans `src/configuration/telemetry/logger/server.ts` (**server-only**, runtime Node) :

| Export             | Rôle                                                                                            |
|--------------------|-------------------------------------------------------------------------------------------------|
| `logger`           | `createPinoLogger({ getScope, getIdentity, getTrace })` — logs applicatifs ad-hoc (JSON stdout) |
| `withActionLogger` | `withLogger(logger)` (pilier action) — middleware de **server action**                          |

Seule l'**action contact** est instrumentée : une server action Next renvoie **HTTP 200 quel que soit le résultat métier**, donc nginx ne voit pas si l'envoi a réussi ou échoué — ce log capte le signal (les échecs vont aussi à Sentry) :

```ts
.use(withActionLogger('action:contact:send'))
```

`event` = `action:contact:send:success` / `:failure` (+ `error.type`). Émission **différée** via `after()`. Le `logger` reste disponible pour de futurs événements applicatifs (signaux métier, dégradations) que l'edge ne capte pas.

**Requêtes LogQL utiles** (Grafana → Explore). Remplace `<selecteur>` par le label réel du conteneur dans Cockpit (à confirmer dans Grafana → Explore : souvent `resource_name` / `container_name`, **pas** `service`) :

```logql
# Edge (nginx) — toutes les requêtes
{<selecteur>} | json | status >= 500                       # taux d'erreur global
{<selecteur>} | json | path =~ "/api/.*" | upstream_time > 1.0   # handlers /api lents (temps app, secondes)
sum by (status) (count_over_time({<selecteur>} | json [5m]))

# Application (pino)
{<selecteur>} | json | event = "action:contact:send:failure"   # échecs d'envoi du formulaire contact
```

> Les `console.*` restants sont du code **navigateur** (`geolocate.tsx`, web-component) — non collectés par Scaleway (seul le stdout serveur l'est) et hors pino (Node-only).

## Limitations assumées

Arbitrages conscients, à lever si le besoin apparaît :

- **Pas de tunnel Sentry** (`tunnelRoute`) → les events sont envoyés **directement** au host du DSN. Le tunnel (proxy via `/monitoring` pour contourner les bloqueurs) est **incompatible avec notre déploiement `output: 'standalone'`** : la route auto-générée n'est pas tracée dans le bundle standalone, donc `/monitoring` renvoyait le HTML de l'app et les events étaient perdus. Comme l'instance est sur un domaine gouv custom (absent des listes Pi-hole/uBlock, qui ciblent `sentry.io`), l'envoi direct est fiable. Ne pas réintroduire `tunnelRoute` sans vérifier que la route est servie en prod.
- **Pas de tracing distribué** (`tracesSampleRate: 0`) → les erreurs n'ont pas de trace liée. Le reporter supporte déjà `getTrace` ; il suffirait d'un petit taux + câbler le getter pour la corrélation erreur↔trace à travers l'API ANCT.
- **Web-component sans reporting** — le build embarquable utilise `createNoopReporter()` pour garder Sentry hors du bundle. Les erreurs dans `<cartographie-inclusion-numerique>` sont invisibles. Option si besoin : beacon léger vers un endpoint de report.
- **Pas de Session Replay** — choix de simplicité / vie privée pour une carte publique.
