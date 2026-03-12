# Intégrer la Cartographie dans votre site web

Ce guide vous explique comment afficher la Cartographie Nationale des lieux d'inclusion numérique sur votre propre site internet. Aucune compétence technique avancée n'est requise : quelques lignes de code suffisent.

## Table des matières

- [Avant de commencer](#avant-de-commencer)
- [Intégration en 3 étapes](#intégration-en-3-étapes)
- [Personnalisation](#personnalisation)
  - [Ajouter votre nom et votre logo](#ajouter-votre-nom-et-votre-logo)
  - [Ajouter un lien d'aide](#ajouter-un-lien-daide)
  - [Personnaliser la position initiale de la carte](#personnaliser-la-position-initiale-de-la-carte)
  - [Filtrer par territoire](#filtrer-par-territoire)
  - [Ajouter votre propre tracking Matomo](#ajouter-votre-propre-tracking-matomo)
  - [Personnaliser les couleurs et le style](#personnaliser-les-couleurs-et-le-style)
- [Exemples complets](#exemples-complets)

---

## Avant de commencer

Pour suivre ce guide, vous pouvez utiliser **l'éditeur en ligne W3Schools** qui permet de tester du code HTML directement dans votre navigateur, sans rien installer :

👉 **[Ouvrir l'éditeur W3Schools](https://www.w3schools.com/html/tryit.asp?filename=tryhtml_basic)**

Une fois sur la page :
1. Vous verrez un éditeur de code à gauche
2. Cliquez sur **Run** pour voir le résultat à droite
3. Modifiez le code et cliquez à nouveau sur **Run** pour voir vos changements

Vous pouvez copier-coller les exemples de ce guide dans l'éditeur pour les tester immédiatement.

---

## Intégration en 3 étapes

### Étape 1 : Préparer la page

Commençons par une page HTML vide. Copiez ce code dans l'éditeur W3Schools :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ma cartographie</title>
  </head>
  <body style="height: 100vh; margin: 0">

  </body>
</html>
```

Cliquez sur **Run** : vous devriez voir une page blanche. C'est normal, nous allons maintenant ajouter la cartographie.

### Étape 2 : Ajouter le style et le script

Dans la balise `<head>`, ajoutez le lien vers la feuille de style :

```html
<link
  href="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie-nationale.css"
  rel="stylesheet"
/>
```

Juste avant `</body>`, ajoutez le script :

```html
<script src="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie.umd.js"></script>
```

Votre code devrait maintenant ressembler à ceci :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ma cartographie</title>
    <link
      href="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie-nationale.css"
      rel="stylesheet"
    />
  </head>
  <body style="height: 100vh; margin: 0">

    <script src="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie.umd.js"></script>
  </body>
</html>
```

Cliquez sur **Run** : cette fois-ci la page est noire, ce qui indique que les ressources sont chargées.

### Étape 3 : Afficher la cartographie

Ajoutez la balise `<cartographie-inclusion-numerique>` dans le `<body>`, juste avant le `<script>` :

```html
<cartographie-inclusion-numerique
  api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
/>
```

**Code complet :**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ma cartographie</title>
    <link
      href="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie-nationale.css"
      rel="stylesheet"
    />
  </head>
  <body style="height: 100vh; margin: 0">
    <cartographie-inclusion-numerique
      api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
    />

    <script src="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie.umd.js"></script>
  </body>
</html>
```

Cliquez sur **Run** : la cartographie s'affiche !

---

## Personnalisation

Vous pouvez personnaliser l'apparence en ajoutant des attributs à la balise. Testez chaque modification dans l'éditeur W3Schools.

### Ajouter votre nom et votre logo

```html
<cartographie-inclusion-numerique
  api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
  logo-url="https://pub-e63b17b4d990438a83af58c15949f8a2.r2.dev/mark/hexa.png"
  app-name="Hub Numérique"
/>
```

| Attribut | Description | Exemple |
|----------|-------------|---------|
| `logo-url` | Adresse de votre logo (PNG, SVG, JPG) | `https://mon-site.fr/logo.png` |
| `app-name` | Nom affiché dans la barre de navigation | `Hub Numérique` |

### Ajouter un lien d'aide

```html
<cartographie-inclusion-numerique
  api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
  help-url="mailto:contact@hub-numerique.fr"
  help-label="Besoin d'aide ?"
/>
```

| Attribut | Description                                     | Exemple                        |
|----------|-------------------------------------------------|--------------------------------|
| `help-url` | Adresse de votre page d'aide ou mail de contact | `https://hub-numerique.fr/aide` ou `mailto:contact@hub-numerique.fr` |
| `help-label` | Texte du bouton (par défaut : "Aide")           | `Besoin d'aide ?`              |

### Personnaliser la position initiale de la carte

Par défaut, la carte est centrée sur la France métropolitaine. Vous pouvez modifier la position et le niveau de zoom initial :

```html
<cartographie-inclusion-numerique
  api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
  latitude="-21.1151"
  longitude="55.5364"
  zoom="10"
/>
```

| Attribut | Description | Exemple |
|----------|-------------|---------|
| `latitude` | Latitude du centre de la carte | `-21.1151` (La Réunion) |
| `longitude` | Longitude du centre de la carte | `55.5364` (La Réunion) |
| `zoom` | Niveau de zoom initial (entre 0 et 20) | `10` |

> **Astuce** : Vous pouvez trouver les coordonnées d'un lieu sur [OpenStreetMap](https://www.openstreetmap.org/) en faisant un clic droit sur la carte.

### Filtrer par territoire

Vous pouvez afficher uniquement les lieux d'un ou plusieurs territoires spécifiques (régions, départements ou communes).

> **Important** : Lorsque vous filtrez par territoire, utilisez également `route-initiale` pour que la cartographie démarre directement sur la vue appropriée. Sans cela, l'utilisateur verra d'abord la vue générale avant de naviguer vers le territoire filtré.

**Exemple : afficher uniquement le Rhône**

```html
<cartographie-inclusion-numerique
  api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
  territoire-type="departements"
  territoires="69"
  route-initiale="/auvergne-rhone-alpes/rhone"
/>
```

**Exemple : afficher uniquement l'Île-de-France**

```html
<cartographie-inclusion-numerique
  api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
  territoire-type="regions"
  territoires="11"
  route-initiale="/ile-de-france"
/>
```

**Exemple : afficher uniquement Le Havre et Montivilliers**

```html
<cartographie-inclusion-numerique
  api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
  territoire-type="communes"
  territoires="76351,76447"
  latitude="49.4944"
  longitude="0.1079"
  zoom="13"
  route-initiale="/normandie/seine-maritime"
/>
```

| Attribut | Description | Valeurs possibles |
|----------|-------------|-------------------|
| `territoire-type` | Type de territoire à filtrer | `regions`, `departements`, `communes` |
| `territoires` | Liste de codes INSEE séparés par des virgules | Codes région, département ou commune |
| `route-initiale` | Page de démarrage | `/{region-slug}` ou `/{region-slug}/{departement-slug}` |

#### Codes INSEE des territoires

Les codes à utiliser sont les **codes INSEE** (Code Officiel Géographique) :
- **Régions** : codes INSEE à 2 chiffres (ex: `11` pour Île-de-France, `84` pour Auvergne-Rhône-Alpes)
- **Départements** : codes INSEE à 2-3 caractères (ex: `75` pour Paris, `69` pour Rhône, `2A` pour Corse-du-Sud)
- **Communes** : codes INSEE à 5 chiffres (ex: `76351` pour Le Havre). **Attention** : ce n'est pas le code postal !

**Où trouver ces codes ?**
- 📋 **[Liste complète des codes et slugs](./codes-territoires.md)** — régions et départements
- 🗺️ **[Carte Base Adresse Nationale](https://adresse.data.gouv.fr/carte-base-adresse-nationale)** — pour les communes, recherchez et consultez le champ "COG"

#### Format des routes

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil avec toutes les régions |
| `/{region-slug}` | Départements d'une région (ex: `/ile-de-france`) |
| `/{region-slug}/{departement-slug}` | Lieux d'un département (ex: `/ile-de-france/paris`) |

> Les slugs sont les versions URL des noms de territoires (sans accents, en minuscules, avec des tirets). Consultez la [liste complète des slugs](./codes-territoires.md).

### Ajouter votre propre tracking Matomo

Si vous disposez de votre propre instance [Matomo](https://matomo.org/), vous pouvez activer le suivi des visites et des interactions sur votre cartographie intégrée :

```html
<cartographie-inclusion-numerique
  api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
  matomo-url="https://analytics.mon-site.fr"
  matomo-site-id="1"
/>
```

| Attribut | Description | Exemple |
|----------|-------------|---------|
| `matomo-url` | URL de votre instance Matomo | `https://analytics.mon-site.fr` |
| `matomo-site-id` | Identifiant du site dans Matomo | `1` |

> **Note** : Le tracking est effectué en mode **cookieless** (sans cookies), conforme aux recommandations de la CNIL. Aucune bannière de consentement n'est nécessaire.

**Événements trackés automatiquement :**
- Pages visitées (régions, départements, fiches lieux)
- Recherches d'adresses
- Sélection de régions et départements sur la carte
- Utilisation des filtres
- Exports de données
- Activation de la couche "Fragilité numérique"

### Personnaliser les couleurs et le style

La cartographie utilise [DaisyUI](https://daisyui.com/) pour ses composants visuels. Vous pouvez adapter les couleurs à votre charte graphique grâce aux variables CSS.

#### Utiliser le générateur de thème DaisyUI

DaisyUI propose un outil visuel pour créer votre propre palette de couleurs :

1. Rendez-vous sur le **[Générateur de thème DaisyUI](https://daisyui.com/theme-generator/)**
2. Utilisez les sélecteurs de couleurs pour personnaliser chaque élément :
   - **Primary** : couleur principale (boutons, liens actifs)
   - **Secondary** : couleur secondaire
   - **Accent** : couleur d'accentuation
   - **Neutral** : couleur neutre (textes, bordures)
   - **Base** : couleurs de fond
   - **Info, Success, Warning, Error** : couleurs des messages
3. Ajustez également les rayons de bordure et autres options de style
4. Une fois satisfait, cliquez sur le bouton **`{} CSS`** en haut à droite

Vous obtiendrez un bloc de code similaire à celui-ci :

```css
@plugin "daisyui/theme" {
  name: "mon-theme";
  --color-base-100: oklch(1 0 89.876);
  --color-base-200: oklch(0.898 0 89.876);
  --color-primary: oklch(0.754 0.13 76.128);
  /* ... autres variables ... */
}
```

#### Appliquer le thème à votre page

Pour utiliser ces couleurs, créez une balise `<style>` dans le `<head>` de votre page et placez les variables CSS dans `:root`. Vous n'avez besoin que des lignes commençant par `--` :

```html
<head>
  <!-- ... vos autres balises ... -->
  <style>
    :root {
      --color-base-100: oklch(1 0 89.876);
      --color-base-200: oklch(0.898 0 89.876);
      --color-base-300: oklch(0.973 0 89.876);
      --color-base-content: oklch(0.348 0 89.876);
      --color-primary: oklch(0.754 0.13 76.128);
      --color-primary-content: oklch(98% 0.022 95.277);
      --color-secondary: oklch(72% 0.219 149.579);
      --color-secondary-content: oklch(98% 0.018 155.826);
      --color-accent: oklch(79% 0.184 86.047);
      --color-accent-content: oklch(98% 0.026 102.212);
      --color-neutral: oklch(14% 0.005 285.823);
      --color-neutral-content: oklch(98% 0 0);
      --color-info: oklch(62% 0.214 259.815);
      --color-info-content: oklch(97% 0.014 254.604);
      --color-success: oklch(72% 0.219 149.579);
      --color-success-content: oklch(98% 0.018 155.826);
      --color-warning: oklch(70% 0.213 47.604);
      --color-warning-content: oklch(98% 0.016 73.684);
      --color-error: oklch(64% 0.246 16.439);
      --color-error-content: oklch(96% 0.015 12.422);
      --radius-selector: 2rem;
      --radius-field: 0.5rem;
      --radius-box: 0rem;
      --size-selector: 0.25rem;
      --size-field: 0.25rem;
      --border: 1px;
      --depth: 1;
      --noise: 0;
    }
  </style>
</head>
```

> **Astuce** : Vous pouvez ne définir que les variables que vous souhaitez modifier. Les autres conserveront leurs valeurs par défaut.

#### Principales variables à connaître

| Variable | Rôle |
|----------|------|
| `--color-primary` | Couleur principale des boutons et éléments interactifs |
| `--color-primary-content` | Couleur du texte sur fond primary |
| `--color-base-100` | Couleur de fond principale |
| `--color-base-content` | Couleur du texte principal |
| `--radius-field` | Arrondi des champs de formulaire |
| `--radius-box` | Arrondi des cartes et conteneurs |

---

### Récapitulatif des attributs

| Attribut | Obligatoire | Description                                                         |
|----------|:-----------:|---------------------------------------------------------------------|
| `api-url` | Oui | URL de l'API des données d'inclusion numérique                      |
| `logo-url` | Non | URL de votre logo                                                   |
| `app-name` | Non | Nom de votre application                                            |
| `help-url` | Non | URL de la page d'aide                                               |
| `help-label` | Non | Texte du bouton d'aide                                              |
| `latitude` | Non | Latitude du centre de la carte (par défaut : France métropolitaine) |
| `longitude` | Non | Longitude du centre de la carte (par défaut : France métropolitaine)|
| `zoom` | Non | Niveau de zoom initial (par défaut : 5)                             |
| `territoire-type` | Non | Type de filtre territoire : `regions`, `departements` ou `communes` |
| `territoires` | Non | Liste de codes territoires séparés par des virgules                 |
| `route-initiale` | Non | Route de départ (ex: `/ile-de-france/paris`)                        |
| `matomo-url` | Non | URL de votre instance Matomo pour le tracking                       |
| `matomo-site-id` | Non | Identifiant du site dans votre instance Matomo                      |

---

## Exemples complets

### Version minimaliste

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cartographie</title>
    <link
      href="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie-nationale.css"
      rel="stylesheet"
    />
  </head>
  <body style="height: 100vh; margin: 0">
    <cartographie-inclusion-numerique
      api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
    />
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie.umd.js"></script>
  </body>
</html>
```

### Version personnalisée

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hub Numérique - Cartographie</title>
    <link
      href="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie-nationale.css"
      rel="stylesheet"
    />
  </head>
  <body style="height: 100vh; margin: 0">
    <cartographie-inclusion-numerique
      api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
      logo-url="https://pub-e63b17b4d990438a83af58c15949f8a2.r2.dev/mark/hexa.png"
      app-name="Hub Numérique"
      help-url="mailto:contact@hub-numerique.fr"
      help-label="Besoin d'aide ?"
    />
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie.umd.js"></script>
  </body>
</html>
```

### Version filtrée par territoire (département du Rhône)

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cartographie du Rhône</title>
    <link
      href="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie-nationale.css"
      rel="stylesheet"
    />
  </head>
  <body style="height: 100vh; margin: 0">
    <cartographie-inclusion-numerique
      api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
      app-name="Inclusion Numérique Rhône"
      latitude="45.7640"
      longitude="4.8357"
      zoom="10"
      territoire-type="departements"
      territoires="69"
      route-initiale="/auvergne-rhone-alpes/rhone"
    />
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie.umd.js"></script>
  </body>
</html>
```

### Version avec thème personnalisé

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ma cartographie personnalisée</title>
    <link
      href="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie-nationale.css"
      rel="stylesheet"
    />
    <style>
      :root {
        /* Couleurs principales */
        --color-primary: oklch(0.6 0.2 250);
        --color-primary-content: oklch(0.98 0 0);
        --color-secondary: oklch(0.7 0.15 180);
        --color-secondary-content: oklch(0.98 0 0);

        /* Couleurs de fond */
        --color-base-100: oklch(0.98 0.01 250);
        --color-base-200: oklch(0.94 0.01 250);
        --color-base-300: oklch(0.90 0.01 250);
        --color-base-content: oklch(0.25 0.02 250);

        /* Style des bordures */
        --radius-field: 0.75rem;
        --radius-box: 0.5rem;
      }
    </style>
  </head>
  <body style="height: 100vh; margin: 0">
    <cartographie-inclusion-numerique
      api-url="https://cartographieprodappcj0ppnhkz-cartographie-prod-app-container.functions.fnc.fr-par.scw.cloud/api"
      app-name="Mon Hub Numérique"
    />
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr-anct/cartographie-nationale@6.3.2/dist-wc/cartographie.umd.js"></script>
  </body>
</html>
```

---

## Besoin d'aide ?

Si vous rencontrez des difficultés :
- Consultez les [issues GitHub](https://github.com/anct-cartographie-nationale/cartographie/issues) pour voir si votre problème a déjà été résolu
- Ouvrez une nouvelle issue pour poser votre question
