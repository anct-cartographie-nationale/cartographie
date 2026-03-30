# Intégrer la Cartographie via un lien URL

Ce guide vous explique comment partager la Cartographie Nationale des lieux d'inclusion numérique avec des paramètres de configuration directement dans l'URL. C'est la méthode la plus simple : aucun code à écrire, juste un lien à partager.

## Table des matières

- [Quand utiliser cette méthode ?](#quand-utiliser-cette-méthode-)
- [URL de base](#url-de-base)
- [Navigation par chemin](#navigation-par-chemin)
- [Paramètres disponibles](#paramètres-disponibles)
- [Récapitulatif](#récapitulatif)

---

## Quand utiliser cette méthode ?

L'intégration par URL est idéale si vous souhaitez :
- Partager un lien vers une vue préconfigurée de la cartographie
- Intégrer la cartographie dans un email ou un document
- Créer un raccourci vers un territoire spécifique

**Pour une personnalisation complète** (logo, couleurs, tracking), consultez le [guide d'intégration par web component](./integration-web-component.md).

---

## URL de base

```
https://cartographie.societenumerique.gouv.fr
```

---

## Navigation par chemin

Ciblez directement une région ou un département en ajoutant son **slug** au chemin :

| Chemin | Description |
|--------|-------------|
| `/{region}` | Page région avec liste des départements |
| `/{region}/{departement}` | Page département avec carte centrée |
| `/{region}/{departement}/lieux` | Liste des lieux du département |

**Exemples :**
- `/bretagne` → Bretagne
- `/bretagne/finistere` → Finistère
- `/bretagne/finistere/lieux` → Liste des lieux du Finistère

> Les slugs sont listés dans [codes-territoires.md](./codes-territoires.md).

---

## Paramètres disponibles

Les paramètres se combinent avec le chemin : `/{chemin}?param1=val1&param2=val2`

### Position de la carte

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `latitude` | Latitude du centre | `48.8566` |
| `longitude` | Longitude du centre | `2.3522` |
| `zoom` | Niveau de zoom (0-20) | `12` |

> **Astuce** : Trouvez les coordonnées sur [OpenStreetMap](https://www.openstreetmap.org/) (clic droit sur la carte).

### Filtrage par territoire

| Paramètre | Description | Valeurs |
|-----------|-------------|---------|
| `territoire_type` | Type de territoire | `regions`, `departements`, `communes` |
| `territoires` | Codes INSEE (séparés par virgules) | `75`, `75,92,93` |

Les codes INSEE sont listés dans [codes-territoires.md](./codes-territoires.md). Pour les communes, utilisez la [Carte Base Adresse Nationale](https://adresse.data.gouv.fr/carte-base-adresse-nationale) (champ "COG").

### Filtres de services

| Paramètre | Description |
|-----------|-------------|
| `services` | Types de services (séparés par virgules) |
| `dispositif_programmes_nationaux` | `Conseillers numériques`, `France Services` |
| `frais_a_charge` | `Gratuit` |

---

## Exemples complets

**Brest uniquement avec vue optimale :**
```
/bretagne/finistere?territoire_type=communes&territoires=29019&latitude=48.3904&longitude=-4.4861&zoom=13
```

**Métropole de Lyon (59 communes) :**
```
/auvergne-rhone-alpes/rhone?territoire_type=communes&territoires=69003,69029,69033,69034,69040,69044,69046,69271,69063,69273,69068,69069,69071,69072,69275,69081,69276,69085,69087,69088,69089,69278,69091,69096,69100,69279,69116,69117,69123,69127,69282,69283,69284,69142,69143,69149,69152,69153,69163,69286,69168,69191,69194,69199,69204,69205,69207,69290,69233,69202,69292,69293,69296,69244,69250,69256,69259,69260,69266&latitude=45.7640&longitude=4.8357&zoom=10
```

**Paris centre :**
```
/ile-de-france?territoire_type=departements&territoires=75&latitude=48.8566&longitude=2.3522&zoom=12
```

**France Services en Île-de-France :**
```
/?territoire_type=regions&territoires=11&dispositif_programmes_nationaux=France%20Services
```

---

## Récapitulatif

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `latitude` | Latitude du centre | `48.8566` |
| `longitude` | Longitude du centre | `2.3522` |
| `zoom` | Niveau de zoom (0-20) | `12` |
| `territoire_type` | Type : `regions`, `departements`, `communes` | `departements` |
| `territoires` | Codes INSEE (virgules) | `75,92,93` |
| `services` | Types de services | `Aide aux démarches administratives` |
| `dispositif_programmes_nationaux` | Programmes nationaux | `France Services` |
| `frais_a_charge` | Gratuité | `Gratuit` |

---

## Besoin d'aide ?

- [Issues GitHub](https://github.com/anct-cartographie-nationale/cartographie/issues)
