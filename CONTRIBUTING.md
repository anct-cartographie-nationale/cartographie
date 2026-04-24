# Guide de contribution

## 📑 Table des matières

- 📦 [Prérequis](#prerequisites)
- 🚀 [Démarrage rapide](#getting-started)
- 🛠️ [Commandes disponibles](#available-scripts)
- 🤝 [Exigences](#requirements)
- 🏗️ [Technologies utilisées](#built-with)
- 🏷️ [Versionnage](#versioning)

<h2 id="prerequisites">📦 Prérequis</h2>

Assurez-vous d’avoir les outils suivants installés avant de configurer le projet :

- [Git](https://git-scm.com/): système de gestion de versions distribué
- [Node.js](https://nodejs.org/): environnement d’exécution pour JavaScript
- [pnpm](https://pnpm.io/): gestionnaire de paquets pour projets Node.js

### Recommandation

> Pour faciliter la gestion des versions de Node.js, vous pouvez utiliser [fnm](https://github.com/Schniz/fnm), qui permet d’installer et de changer facilement de version en ligne de commande.

<h2 id="getting-started">🚀 Démarrage rapide</h2>

Suivez ces étapes pour configurer le projet :

### 1. Cloner le dépôt localement

```bash
git clone git@github.com:anct-cartographie-nationale/cartographie.git
```

### 2. Installer les dépendances

```bash
cd cartographie
pnpm install
```

Après ces étapes, vous êtes prêt à travailler sur le projet. Bon développement ! 🎉

<h2 id="available-scripts">🛠️ Commandes disponibles</h2>

Voici les principales commandes utiles au développement :

### `pnpm dev`

Lance l’application en mode développement.\
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

La page se rechargera automatiquement en cas de modifications.

### `pnpm build`

Construit l’application pour la production dans le dossier `build`.\
L’optimisation est effectuée, React est configuré en mode production.

Les fichiers sont minifiés et leurs noms contiennent des signatures.\
L’application est prête à être déployée !

### `pnpm test`

Lance le framework de tests [Vitest](https://vitest.dev/).\
Les tests se relancent automatiquement à chaque modification.

### `pnpm code:check`

Analyse statiquement le code source et applique les corrections automatiques de style et de syntaxe.

### `pnpm biome:ci`

Analyse statiquement le code source et affiche les erreurs de style et de syntaxe dans la console.

### `pnpm lint:commit`

Vérifie la syntaxe des commits réalisés depuis le dernier commit commun avec la branche `main`.

<h2 id="requirements">🤝 Exigences</h2>

### Branches

- **Toujours synchroniser avec**: Maintenez les branches à jour via un rebase pour garder un historique linéaire.
- **Utiliser des préfixes conventionnels**: Lors de la création d’une branche, utilisez un préfixe adapté : `build/`, `chore/`, `ci/`, `docs/`, `feat/`, `fix/`, `perf/`, `refactor/`, `revert/`, `style/` ou `test/`. Voir la [Conventional Commits cheat sheet](https://kapeli.com/cheat_sheets/Conventional_Commits.docset/Contents/Resources/Documents/index) pour plus de détails.

### Commits

- **Respecter la spécification des Commits Conventionnels** : Tous les messages de commit doivent suivre la spécification des [Commits Conventionnels](https://www.conventionalcommits.org/fr).
- **Signer les commits** : Les commits doivent être signés avec une clé GPG. Voir [About commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification) pour l’activer.

### Étapes de création d'une nouvelle fonctionnalité

1. **Créer une branche** : `git checkout -b feat/ma-fonction-geniale`
2. **Commiter vos changements** : `git commit -m "feat: ajout d'une fonctionnalité géniale"`
3. **Pousser la branche** : `git push origin feat/ma-fonction-geniale`
4. **Créer une Pull Request** : Une fois poussée, ouvrez une PR vers la branche `main`, décrivez vos changements et demandez une revue

<h2 id="built-with">🏗️ Technologies utilisées</h2>

### Langages & Frameworks

- [TypeScript](https://www.typescriptlang.org/) : langage principal, surcouche statique à JavaScript
- [React](https://react.dev/) : bibliothèque JavaScript déclarative pour construire des interfaces utilisateur
- [Next.js](https://nextjs.org/): framework construit sur React pour créer des applications web full-stack

### Outils

- [Vitest](https://vitest.dev/) : framework de tests unitaires
- [Biome](https://biomejs.dev/) : analyseur statique et formateur code
- [Husky](https://typicode.github.io/husky/#/) : exécute des scripts git automatiques
- [Commitlint](https://github.com/conventional-changelog/commitlint): vérifie que les messages de commits respectent bien la spécification des [Commits Conventionnels](https://www.conventionalcommits.org/fr)
- [Lint-staged](https://github.com/okonet/lint-staged): applique les linters aux fichiers stagés dans Git

### Intégration continue

- [GitHub Actions](https://docs.github.com/en/actions): outil d’intégration et de déploiement continu de GitHub
  - L'exécution des workflows est disponible sous [l'onglet Actions](https://github.com/anct-cartographie-nationale/cartographie/actions)
- Secrets (dans Settings > Secrets and variables > Actions) :
  - `INCLUSION_NUMERIQUE_API_TOKEN`: Token d’authentification pour l’API ANCT DataSpace
  - `CACHE_RESET_TOKEN`: Token Bearer pour l’endpoint `POST /api/cache/reset`, permet de déclencher le rechargement du cache des lieux en mémoire après une mise à jour des données
- Variables pour l’environnement `github-pages` :
  - `NEXT_PUBLIC_BASE_PATH`: `/cartographie`, utilisé dans `NextConfig` au moment du build pour configurer le chemin de base de l’application `basePath`
  - `NEXT_PUBLIC_ASSET_PREFIX`: `/cartographie`, utilisé dans `NextConfig` au moment du build pour configurer le chemin de base de l’application `assetPrefix`
- Workflows:
  - [Validation des branches](./.github/workflows/validate-feature-branch.yml): Exécuté à chaque création de branche avec préfixe conventionnel. Vérifie la qualité avant fusion dans la branche `main`
  - [Publication sur GitHub Pages](./.github/workflows/publish-on-github-pages.yml): Exécuté lors des fusions dans la branche `main`. Construit et publie le site statique sur GitHub Pages.
    - Utilise l’environnement `github-pages`, créé automatiquement via l’interface de `GitHub Action` dans la section `Build and deployment` de `Settings/Pages`

### Déploiement continu

- [GitHub Pages](https://pages.github.com/) : service d’hébergement statique gratuit proposé par GitHub

<h2 id="versioning">🏷️ Versionnage</h2>

Ce projet utilise la [Gestion sémantique de version 2.0.0](https://semver.org/lang/fr/) pour définir les versions, assurant un cycle de publication clair et une rétrocompatibilité.
