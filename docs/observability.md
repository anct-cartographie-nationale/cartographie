# Observabilité — capture d'erreurs (Sentry)

Ce document décrit le système de capture d'erreurs de la Cartographie : ce qui est capté, comment c'est câblé, et les étapes de configuration nécessaires pour que les erreurs remontent réellement en production.

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Couverture](#couverture)
- [Configuration requise](#configuration-requise)
- [⚠️ Ne pas lancer le wizard Sentry](#️-ne-pas-lancer-le-wizard-sentry)
- [Vérification locale (Bugsink)](#vérification-locale-bugsink)
- [Étapes opérationnelles](#étapes-opérationnelles)
- [Limitations assumées](#limitations-assumées)

---

## Vue d'ensemble

Le reporting passe par `@sentry/nextjs`, abstrait derrière `@arckit/telemetry` (reporter vendor-agnostic). Tout le câblage applicatif est dans `src/configuration/telemetry/error-reporter/` :

| Fichier | Rôle |
|---|---|
| `report-error.ts` | `errorReporter = createSentryReporter()` (isomorphe, client + serveur) |
| `sentry-options.ts` | base partagée de `Sentry.init` : `tracesSampleRate`, `sendDefaultPii`, `environment`, `beforeSend` |
| `client.ts` | `register()` navigateur + `ignoreErrors` / `denyUrls` (bruit) |
| `server.ts` | `register()` serveur + `onRequestError`, `withErrorReporter` (actions), `withErrorHandler` (routes) |
| `scrub-event.ts` | fonction pure : caviarde les emails avant envoi (PII) |
| `index.ts` | ré-export de `errorReporter` (consommé par les error boundaries) |

`Sentry.init` est **gardé par `NEXT_PUBLIC_SENTRY_DSN`** : sans DSN, l'init est court-circuitée et aucun event n'est émis (no-op propre en local/CI).

L'enregistrement se fait via les points d'entrée Next.js :
- `src/instrumentation.ts` → `register()` serveur + export `onRequestError`
- `src/instrumentation-client.ts` → `register()` navigateur + `onRouterTransitionStart`

## Couverture

| Surface | Mécanisme |
|---|---|
| Serveur non rattrapé (RSC, route handlers, actions qui throw) | `onRequestError` |
| Routes d'export CSV (corps du handler converti en Response) | `withErrorHandler` (`createWithErrorHandler`) |
| Action serveur contact (avalée par `actionBuilder`) | `withErrorReporter` |
| Rendu client (React) | `error.tsx` + `global-error.tsx` |
| Client non rattrapé (`onerror` / `unhandledrejection`) | handlers globaux Sentry (auto) |
| Transitions de navigation | `onRouterTransitionStart` |
| Fetch chunk carte (client) | `inject(ERROR_REPORTER).captureMessage` |
| Rafraîchissement cache en arrière-plan (`/api/cache/reset`) | `invalidateCache(onError)` → reporter au boundary |

Les emails sont caviardés avant envoi (`beforeSend: scrubEvent`) ; `sendDefaultPii: false` retire cookies/headers/IP.

## Configuration requise

Sans ces valeurs, **Sentry reste sur l'écran « Get Started » (zéro event)**. Aucune ligne de code à écrire — uniquement de la configuration.

### 1. Récupérer le DSN

Sentry → projet `cartographie` → **Settings → Client Keys (DSN)**.

### 2. GitHub → Settings → Secrets and variables → Actions

| Nom | Type | Valeur |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Variable | le DSN (public, exposé côté client) |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Variable | `production` (ou `preprod`) |
| `SENTRY_ORG` | Variable | `sentry` |
| `SENTRY_PROJECT` | Variable | `cartographie` |
| `SENTRY_AUTH_TOKEN` | **Secret** | token Sentry, scopes `project:releases` + lecture org → source maps + releases |

Ces valeurs sont injectées au build par `.github/workflows/deploy.yml` (étape `Create env file` pour les `NEXT_PUBLIC_*`, env de l'étape `Build` pour les creds Sentry). Les `NEXT_PUBLIC_*` sont **inlinés au build** : ils doivent donc être présents au moment du `pnpm build`, pas seulement au runtime.

### 3. Variables d'environnement (référence)

Voir `.env.example`. Côté Sentry :
- `NEXT_PUBLIC_SENTRY_DSN` — active la capture (client + serveur)
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT` — tag `environment` (triage prod/preprod)
- `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` — upload des source maps + création de release (build uniquement)

## ⚠️ Ne pas lancer le wizard Sentry

`npx @sentry/wizard@latest -i nextjs` est conçu pour un projet **sans** SDK. Le nôtre est déjà intégré, et plus proprement (instrumentation custom, init gardé par DSN, reporter abstrait). Lancer le wizard créerait des fichiers concurrents (`sentry.client.config.ts`, etc.) et casserait cette architecture. **Il ne manque que les valeurs de configuration ci-dessus.**

## Vérification locale (Bugsink)

`docker-compose.yml` fournit un service [Bugsink](https://www.bugsink.com/) (compatible protocole Sentry, conteneur unique, SQLite, éphémère) pour vérifier la capture de bout en bout sans toucher au projet Sentry de prod. Pointer `NEXT_PUBLIC_SENTRY_DSN` du `.env` local vers le DSN Bugsink, puis déclencher une erreur.

## Étapes opérationnelles

Une fois les events qui remontent, ce qui fait passer « bonne capture » à « système de premier plan » :

1. **Alerting + ownership** (Sentry) — règles d'alerte (Slack/email), détection de pics, assignation auto. *Le plus gros levier restant.*
2. **Vérifier l'onglet Releases** — doit se peupler à chaque déploiement (suivi de régressions, suspect commits). Si vide, vérifier que `SENTRY_AUTH_TOKEN` est bien fourni au build.
3. **Intégration Git** du dépôt dans Sentry — suspect commits + liens stack-frame → fichier.

## Limitations assumées

Arbitrages conscients, à lever si le besoin apparaît :

- **Pas de tracing distribué** (`tracesSampleRate: 0`) → les erreurs n'ont pas de trace liée. Le reporter supporte déjà `getTrace` ; il suffirait d'un petit taux + câbler le getter pour la corrélation erreur↔trace à travers l'API ANCT.
- **Web-component sans reporting** — le build embarquable utilise `createNoopReporter()` pour garder Sentry hors du bundle. Les erreurs dans `<cartographie-inclusion-numerique>` sont invisibles. Option si besoin : beacon léger vers un endpoint de report.
- **Pas de Session Replay** — choix de simplicité / vie privée pour une carte publique.
