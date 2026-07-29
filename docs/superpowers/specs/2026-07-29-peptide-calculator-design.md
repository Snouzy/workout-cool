# Peptide Calculator — Design

**Date**: 2026-07-29
**Route**: `/[locale]/tools/peptide-calculator`
**Statut**: validé, prêt pour plan d'implémentation

---

## 1. Objectif

Publier un calculateur de peptides qui convertit une dose en volume et en graduations de
seringue U-100, dans les 6 locales de l'application, et le positionner sur le cluster
`peptide calculator` — 201 000 recherches/mois aux US, en croissance de +173 % sur 12 mois,
sur un SERP occupé par des pages fines de vendeurs.

Le positionnement éditorial est **outil de conversion**, jamais conseil de dosage. Cette
contrainte est structurante : elle décide du contenu des presets, du texte, et du schema.

---

## 2. Données SEO de référence

Sources : DataForSEO Labs (Google Ads) + Semrush via monid, croisées le 2026-07-29.

### Volumes par marché

| Marché | Mot-clé pivot | Volume/mois | KD | Tendance 12 mois |
|---|---|---|---|---|
| US (en) | `peptide calculator` | 201 000 (Semrush) / 301 000 (DFS) | 14–25 | +173 % |
| US (en) | `peptide dosage calculator` | 14 800 | 9 | +402 % |
| US (en) | `peptide reconstitution calculator` | 14 800 | 15 | +123 % |
| UK (en) | `peptide calculator` | 18 100 | — | +652 % |
| BR (pt) | `calculadora de peptídeos` | 260 | — | 0 → 100 |
| FR (fr) | `calculateur peptide` | 90–210 | — | +50 % / trim. |
| RU (ru) | `калькулятор пептидов` | 90 | 2 | plat |
| ES (es) | `calculadora de péptidos` | 10 | — | émergent |
| ZH (zh-CN) | — | pas de données | — | Google bloqué en Chine |

Conclusion : ~99 % du volume est anglophone. L'anglais est la locale de référence ;
les 5 autres sont livrées complètes mais ne portent pas l'enjeu de trafic.

### Longue traîne exploitable (US)

`peptide calculator dose` (14 800) · `bachem peptide calculator` (9 900) ·
`peptide calculator in mg` (1 600) · `peptide calculator app` (1 600) ·
`peptide calculator for tirzepatide` (880, **KD 1**) · `peptide mixing calculator` (880) ·
`peptide bac water calculator` (720) · `peptide blend calculator` (590) ·
`peptide dilution calculator` (260) · `reverse peptide calculator` (210) ·
`how many units is 250 mcg` (170) · `mcg to units calculator` (50, KD 5).

### SERP

Top 10 sur `peptide calculator` et `peptide reconstitution calculator` : `riteaid.com` (#1,
titre « Peptide Calculator: Reconstitution, Dosage & Syringe Units »), `cellgenic.com`,
`particlepeptides.com`, `howmuchbacwater.com`, `primepeptides.co`, `solcarahealth.com`,
`royalmedicalcenters.com`, `onyxbiolabs.com`, plus YouTube et Google Play.

Ce sont majoritairement des vendeurs de peptides et des cliniques avec des pages minces.
Aucun outil réellement soigné, aucune couverture multilingue.

SERP features : `AI_OVERVIEW`, `PEOPLE_ALSO_ASK`, `IMAGE_PACK`, `VIDEO`, `RELATED_SEARCHES`.

### People Also Ask (réels, relevés le 2026-07-29)

1. How to calculate peptide reconstitution?
2. How many mL of bacteriostatic water to mix with peptides?
3. How many mL to reconstitute 10 mg?
4. How to reconstitute 30 mg of peptides?
5. How much water to reconstitute 10 mg of peptide?
6. How to figure out reconstitution?

La question 5 est aujourd'hui satisfaite par un **tableau** (Peptide Amount / Bac Water Added /
Final Concentration). Reproduire ce format de tableau est le levier le plus direct pour
capter le PAA.

Recherches associées : `peptide dosing chart`, `peptide reconstitution chart`,
`peptide reconstitution calculator online free`, `peptide calculator app`.

---

## 3. Architecture

```
app/[locale]/(app)/tools/peptide-calculator/
├── page.tsx                         Server Component : metadata, JSON-LD, hero, ads
├── lib/
│   ├── types.ts                     SyringeSize, PeptideInput, PeptideResult, WarningCode
│   ├── calculate.ts                 moteur pur, sans React ni i18n
│   └── presets.ts                   tailles de flacon par peptide
├── ui/
│   ├── PeptideCalculatorClient.tsx  "use client", orchestre l'état
│   └── components/
│       ├── SyringeSelector.tsx
│       ├── OptionChips.tsx          rangée générique de chips + « Other »
│       ├── SyringeRuler.tsx         règle graduée
│       ├── ResultCard.tsx
│       ├── ReverseResultCard.tsx    résultat du mode inverse
│       ├── EducationalContentServer.tsx
│       ├── SEOContentServer.tsx
│       └── FAQAccordion.tsx
└── seo/
    ├── config.ts                    title / description / keywords × 6 locales
    └── page-content.ts              guide long + FAQ × 6 locales
```

Le pattern suit `tools/heart-rate-zones`, le plus abouti des outils existants.

**Frontières :**

- `lib/calculate.ts` prend des nombres et rend des nombres plus une liste de codes de
  warning. Il ne connaît ni React, ni les traductions, ni le DOM. Testable isolément.
- `OptionChips` est générique et sert trois fois (flacon, eau, dose). Une seule
  implémentation du comportement « chips + Autre ».
- `SyringeRuler` ne reçoit que `{ units, capacity }`. Aucune logique métier.
- Aucun fichier ne dépasse ~150 lignes.

**i18n** : les chaînes d'UI vont dans `tools["peptide-calculator"]` de chacun des 6
`locales/*.ts`, comme `heart-rate-zones`. Le contenu SEO long reste dans
`seo/page-content.ts` pour ne pas doubler la taille des fichiers de locale.

**URL** : slug anglais `peptide-calculator` dans les 6 locales, cohérent avec les outils
existants (`heart-rate-zones`, `one-rep-max`, `bmi-calculator`).

---

## 4. Moteur de calcul

```
concentration (mg/ml) = vialMg / waterMl
volume (ml)           = (doseMcg / 1000) / concentration
units (U-100)         = volume × 100
dosesPerVial          = floor(vialMg × 1000 / doseMcg)
```

Vérification sur le mockup de référence : flacon 10 mg, 5 ml d'eau → 2 mg/ml ;
dose 250 mcg = 0,25 mg → 0,125 ml → **12,5 U** ; 40 doses par flacon.

### Mode inverse

Toggle : l'utilisateur saisit les unités prélevées, le moteur rend la dose en mcg.

```
doseMcg = (units / 100) × concentration × 1000
```

Cible `reverse peptide calculator` (210) et `how many units is 250 mcg` (170).

### Warnings

Le moteur rend des codes ; l'UI les traduit.

| Code | Déclencheur | Intention du message |
|---|---|---|
| `EXCEEDS_SYRINGE` | `units > capacity` | Dose au-delà de la seringue choisie : prendre une plus grande ou réduire l'eau |
| `TOO_SMALL_TO_MEASURE` | `units < 2` | Moins de 2 graduations : précision faible, ajouter moins d'eau |
| `WATER_EXCEEDS_VIAL` | `waterMl > 10` | Volume inhabituel pour un flacon standard |
| `NOT_A_WHOLE_GRADUATION` | `units` non multiple de 0,5 | Indiquer l'arrondi à la graduation la plus proche |

### Validation des entrées

`vialMg`, `waterMl`, `doseMcg` strictement positifs et finis. Toute entrée invalide rend un
résultat `null` plutôt qu'un `NaN` affiché. Bornes hautes larges mais présentes pour éviter
les saisies absurdes : `vialMg ≤ 1000`, `waterMl ≤ 100`, `doseMcg ≤ 100000`.

### Presets

Un preset pré-remplit **uniquement la taille du flacon**, donnée d'étiquette factuelle.
La dose reste toujours saisie par l'utilisateur. C'est ce qui permet de capter
`peptide calculator for tirzepatide` (KD 1) et `bpc 157 dosage calculator` sans jamais
suggérer de posologie.

| Peptide | Tailles de flacon |
|---|---|
| BPC-157 | 5 / 10 mg |
| TB-500 | 5 / 10 mg |
| Ipamorelin | 5 / 10 mg |
| CJC-1295 | 2 / 5 mg |
| Tirzepatide | 10 / 20 / 30 / 60 mg |
| Retatrutide | 10 / 20 mg |
| Semaglutide | 5 / 10 mg |
| GHK-Cu | 50 / 100 mg |

### État dans l'URL

`?vial=10&water=5&dose=250&syringe=50`. Rend le résultat partageable et linkable, ce qui
est un signal de backlink naturel sur ce type d'outil. Lecture au montage, écriture en
`replaceState` pour ne pas polluer l'historique.

---

## 5. UX

Structure du mockup, habillage des outils existants : hero emoji + `h1` + sous-titre,
`bg-gradient-to-b from-blue-50 to-white` / `dark:from-gray-900 dark:to-gray-800`, cartes
DaisyUI, badges bleus.

```
Hero : 💉 + H1 + sous-titre

Raccourcis peptides (chips)

01 Seringue            │ 02 Flacon (mg)  [chips]
  0.3 ml / 30 U        │ 03 Eau (ml)     [chips]
  0.5 ml / 50 U        │ 04 Dose (mcg)   [chips]
  1 ml / 100 U         │
  (PNG fournis)        │

RÉSULTAT (pleine largeur)
  Draw to 12.5 U — 250 mcg = 0.125 ml
  [Concentration 2 mg/ml] [Doses per vial 40]
  règle graduée SVG avec curseur
```

Sur mobile, les colonnes s'empilent dans l'ordre 01 → 02 → 03 → 04 → résultat.

**Décisions :**

- **Chips** : `role="radiogroup"`, navigation aux flèches, « Other » bascule en
  `<input type="number">` inline.
- **Règle graduée** : construite en `div` positionnés en pourcentage, pas en SVG — le texte
  des graduations garde ainsi une taille lisible à toute largeur, ce qu'un `viewBox` SVG
  proportionnel ne permet pas. Sous 640 px, une graduation sur 5 seulement. Aucun scroll
  horizontal du body.
- **Images seringues** : `next/image`, `width`/`height` explicites, la première en
  `priority`, les deux autres en `lazy`. Évite le CLS.
- **Pas de bouton « Calculer »** : recalcul à chaque changement.
- **Résultat rendu côté serveur** avec les valeurs par défaut (10 mg / 5 ml / 250 mcg /
  seringue 50 U) : Google indexe un résultat rempli, pas un état vide.
- **Accessibilité** : `aria-live="polite"` sur le bloc résultat, warnings en `role="status"`,
  contraste AA vérifié en clair et en sombre.

**Valeurs par défaut** : seringue 0,5 ml / 50 U, flacon 10 mg, eau 5 ml, dose 250 mcg.
Elles reproduisent l'exemple du mockup et donnent un résultat non trivial (12,5 U).

---

## 6. SEO et contenu

### Meta (EN, référence)

- **Title** : `Peptide Calculator — Reconstitution, Dosage & Syringe Units` (59 car.)
- **Description** : `Free peptide calculator: enter vial size, bacteriostatic water and dose to get the exact units to draw on a U-100 insulin syringe.` (~140 car.)
- **H1** : `Peptide Calculator`

Les 5 autres locales sont déclinées dans `seo/config.ts` avec leurs propres mots-clés,
pas des traductions littérales de l'anglais.

### Plan de contenu (~1 800 mots, identique en structure dans les 6 locales)

1. Comment utiliser le calculateur — 3 phrases, citables telles quelles
2. La formule expliquée, avec l'exemple chiffré 10 mg / 5 ml / 250 mcg
3. **Tableau de reconstitution** au format PAA (Peptide Amount / Bac Water Added / Final
   Concentration) — cible directement le PAA aujourd'hui détenu par un tiers
4. **Tableau de conversion mcg → unités** pour les concentrations courantes — cible
   `mcg to units calculator`, `how many units is 250 mcg`, `peptide dosing chart`
5. Comprendre la seringue U-100 : pourquoi 1 ml = 100 unités
6. Eau bactériostatique vs eau stérile — cible `peptide bac water calculator`
7. Erreurs de calcul fréquentes
8. FAQ : les 6 questions PAA relevées, plus 2 sur les unités de seringue
9. Disclaimer

### Schema JSON-LD

`WebApplication` + `FAQPage` + `HowTo` + `BreadcrumbList`.

`FAQPage` et `HowTo` sont l'ajout par rapport à `heart-rate-zones` : ce sont eux qui
déclenchent les rich results et alimentent l'AI Overview présent sur
`peptide reconstitution calculator`.

### GEO / AI Overview

Chaque section s'ouvre par une réponse autonome de 40 à 60 mots, citable hors contexte par
un LLM. Pas d'anaphore vers le paragraphe précédent dans ces ouvertures.

### E-E-A-T / YMYL

- Positionnement « outil de conversion », jamais « conseil de dosage ».
- Disclaimer sous le résultat **et** en fin de page.
- `dateModified` réel, `author` = Organization WorkoutCool.
- Aucune recommandation de dose, aucun lien sortant vers un vendeur de peptides.

### Maillage

Carte ajoutée sur `/tools`, liens croisés depuis `bmi-calculator` et `calorie-calculator`,
`hreflangPath: "/tools/peptide-calculator"` pour les 6 alternates.

---

## 7. Tests

- `lib/calculate.ts` : cas nominal du mockup, chacun des 4 warnings, mode inverse,
  entrées invalides (zéro, négatif, `NaN`), aller-retour direct/inverse.
- `lib/presets.ts` : toutes les tailles de flacon sont des nombres positifs.
- `seo/config.ts` et `page-content.ts` : les 6 locales exposent les mêmes clés.
- `locales/*.ts` : `tools["peptide-calculator"]` a la même forme dans les 6 fichiers.

---

## 8. Ordre d'exécution

1. Moteur, presets, types, tests
2. UI et composants
3. `page.tsx`, schema, ads, maillage
4. Contenu **EN** complet
5. Contenu **PT-BR** (courbe 0 → 100, early-mover)
6. Contenu **FR**
7. Contenu **ES**
8. Contenu **RU**
9. Contenu **ZH-CN**

Une langue à la fois, chacune relue avant de passer à la suivante.

---

## 9. Hors périmètre

- Suivi de protocole, historique d'injections, rappels — c'est un outil sans état.
- Calcul de blends multi-peptides : `peptide blend calculator` ne pèse que 590/mois et
  double la complexité de l'UI. À réévaluer une fois la page installée.
- Poids moléculaire (`peptide molecular weight calculator`, 480) : intention scientifique
  différente, mériterait sa propre page.
