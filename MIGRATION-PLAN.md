# Plan de Migration : Cartographie → Architecture Blue Mapping

Ce document décrit le plan de migration de l'architecture actuelle (Cartographie) vers l'architecture cible (Blue Mapping).

## Résumé des Changements Architecturaux

| Aspect | Actuel (Cartographie) | Cible |
|--------|----------------------|-------|
| **Structure** | `features/` plates | `features/*/abilities/*/` |
| **DI** | piqure simple | piqure + structure implementations (imports directs) |
| **Validation** | Zod | Zod (conservé) |
| **Server Actions** | Directes | Builder fluide avec middlewares |
| **Architecture enforcement** | Aucun | dependency-cruiser + folderslint |
| **Implémentations** | Hardcodées | Structure par dossier, import direct modifiable |

---

## Phase 1 : Fondations ✅ COMPLÈTE

### 1.1 Configuration de l'enforcement architectural
- [x] Installer et configurer `dependency-cruiser`
- [x] Créer `.dependency-cruiser.cjs` avec règles de séparation des domaines
- [x] Installer et configurer `folderslint`
- [x] Créer `.folderslintrc` avec la structure cible
- [x] Ajouter les scripts npm : `lint:arch`, `lint:folders`

### 1.2 Évolution du conteneur DI
- [x] Créer `src/libraries/injection/container.ts` avec `key()` helper
- [x] Créer `src/libraries/injection/with-injectable.ts` pour lazy loading
- [x] Documenter le pattern d'injection par contrat (voir CLAUDE.md)

---

## Phase 2 : Librairies Partagées ✅ COMPLÈTE

### 2.1 Création du Server Action Builder
- [x] Créer `src/libraries/server-action/action.ts` (builder fluide)
- [x] Créer `src/libraries/server-action/server-action-result.ts` (types)
- [x] Implémenter les middlewares de base :
  - [x] `withInput` - validation des entrées (Zod)
  - [x] `withHeaders` - injection des headers
- [x] Créer `src/libraries/server-action/handle-server-action-error.ts`

### 2.2 Création du Page Builder
- [x] Créer `src/libraries/next/page/page.ts`
- [x] Créer les middlewares de page :
  - [x] `withParams` - extraction des params dynamiques
  - [x] `withSearchParams` - extraction des query params
  - [x] `withClientBinder` pour DI côté client
- [x] Web Components : utilise TanStack Router (pas d'adaptation nécessaire)
  - `useParams()` / `useSearch()` remplacent les middlewares
  - `validateSearch` avec Zod pour la validation
  - Voir `src/web-components/router.tsx`

---

## Phase 3 : Restructuration des Features ✅

### 3.1 Feature `cartographie` ✅
Structure finale :
```
features/cartographie/
├── abilities/
│   ├── controls/          # Bouton géolocalisation
│   │   └── geolocate.tsx
│   ├── map-view/          # Composants carte et pages
│   │   ├── pages/
│   │   ├── cartographie.tsx
│   │   ├── departements-on-map.tsx
│   │   ├── fragilite-numerique-layers.tsx
│   │   └── regions-on-map.tsx
│   └── search/            # Recherche d'adresse
│       ├── address-combobox.tsx
│       └── search-address.tsx
├── infrastructure/        # Highlight découpages administratifs
│   └── highlight-decoupage-administratif.ts
└── index.ts
```

### 3.2 Feature `lieux-inclusion-numerique` ✅
Structure finale :
```
features/lieux-inclusion-numerique/
├── abilities/
│   ├── detail-view/       # Fiche lieu détaillée
│   │   └── sections/
│   ├── exporters/         # Export CSV
│   │   └── to-csv/
│   ├── filters-ui/        # UI des filtres
│   ├── list-view/         # Liste des lieux
│   └── map-view/          # Affichage sur carte
├── domain/                # Types réexportés
├── infrastructure/        # Streams et highlight
│   ├── lieux/
│   └── streams/
└── index.ts
```

### 3.3 Feature `collectivites-territoriales` ✅
Structure finale :
```
features/collectivites-territoriales/
├── abilities/
│   ├── append-collectivites/  # Enrichissement des lieux
│   └── stats-query/           # Requêtes statistiques
├── domain/                    # Régions, départements, types
└── index.ts
```

### 3.4 Feature `address`
- [x] Conservée dans `libraries/address/` (type simple, pas une feature)
- [x] Recherche d'adresse intégrée dans `cartographie/abilities/search/`

### 3.5 Feature `brand` ✅
Structure finale :
```
features/brand/
├── abilities/
│   └── layout/            # Layout principal, navbar
│       └── logos/
└── index.ts
```

### 3.6 Nettoyage du code ✅
- [x] Suppression des duplications (`applyTerritoireFilter`, code INSEE)
- [x] Extraction de `getDepartementCodeFromInsee` dans `libraries/collectivites`
- [x] Extraction de `getThemeColors` dans `libraries/map`
- [x] Correction des imports barrel (server/client separation)

---

## Phase 4 : Mise à jour de `src/app/` ✅ COMPLÈTE

### 4.1 Adoption du Page Builder
- [x] Migrer les pages pour utiliser le page builder avec middlewares
  - 8 pages migrées vers `page.with().render()` pattern
  - Middlewares créés : `withRegion`, `withDepartement`, `withUrlSearchParams`
  - Middlewares déplacés vers `features/collectivites-territoriales/abilities/page-middlewares/`
- [x] Pas de Server Actions à migrer (aucune trouvée)
- [ ] Implémenter les Error Boundaries React (optionnel)

### 4.2 Mise à jour des routes
- [x] `(with-map)/` : intégration des abilities cartographie
- [x] `(full-page)/` : intégration des abilities lieux
- [x] Compatibilité Web Components vérifiée (build OK)

---

## Phase 5 : Web Components

### 5.1 Adaptation du dual-build
- [ ] Mettre à jour `vite-plugin-file-replacement.ts` pour les nouveaux paths
- [ ] Créer les `.wc.tsx` nécessaires pour les nouvelles abstractions
- [ ] Tester le build Web Components avec la nouvelle architecture

### 5.2 Simplification des shims
- [ ] Évaluer si les shims peuvent être réduits grâce à la DI
- [ ] Documenter les différences Next.js vs Web Components

---

## Phase 6 : Documentation et Finalisation

### 6.1 Documentation
- [ ] Mettre à jour `CLAUDE.md` avec la nouvelle architecture
- [ ] Créer des ADRs (Architecture Decision Records) pour les choix majeurs
- [ ] Documenter les patterns dans un `docs/architecture.md`

### 6.2 Nettoyage
- [x] Supprimer le code mort
- [x] Vérifier les duplications
- [x] Lancer `dependency-cruiser` et corriger les violations (0 violations)

### 6.3 Validation finale
- [x] Vérifier que le build Next.js fonctionne
- [x] Vérifier que le build Web Components fonctionne
- [ ] Review de l'architecture avec l'équipe

---

## Ordre de Priorité Recommandé

```
Phase 1 (Fondations)           ██████████ ✅ Complète
Phase 2 (Librairies)           ██████████ ✅ Complète
Phase 3 (Features)             ██████████ ✅ Complète
Phase 4 (App)                  ██████████ ✅ Complète
Phase 5 (Web Components)       ██████████ ✅ Build OK
Phase 6 (Finalisation)         ████████░░ Quasi-complète
```

---

## Risques et Mitigations

| Risque                        | Impact | Mitigation                             |
|-------------------------------|--------|----------------------------------------|
| Régression fonctionnelle      | Élevé  | Vérification manuelle à chaque étape   |
| Complexité accrue             | Moyen  | Documentation et formation équipe      |
| Incompatibilité Web Components| Élevé  | Tester le dual-build à chaque phase    |
| Temps de migration            | Moyen  | Migration incrémentale par feature     |

---

## Métriques de Succès

- [x] Zéro violation dependency-cruiser
- [x] Zéro violation folderslint
- [x] Build Next.js fonctionnel
- [x] Build Web Components fonctionnel
- [ ] Documentation à jour

---

## Notes

- Cette migration peut être faite **incrémentalement** : chaque feature peut être migrée indépendamment
- Le dual-build (Next.js + Web Components) doit rester fonctionnel à chaque étape
- Les streams RxJS existants sont conservés, mais mieux structurés
- Zod est conservé pour toutes les validations
- Les tests seront ajoutés dans une phase ultérieure, en dehors de cette migration
