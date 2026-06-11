# DESIGN-SYSTEM.md — Migration "Field Ops" pour mikedevnomad.com

> Objectif : appliquer ce design system au site Next.js EXISTANT.
> ⚠️ NE PAS modifier la structure des pages, les routes (/pro, /nomade), ni le contenu.
> Uniquement : styles, typographie, couleurs, et ajout des composants signature listés ci-dessous.

---

## 1. Tokens (CSS variables ou Tailwind config)

### Couleurs
| Token       | Hex       | Usage |
|-------------|-----------|-------|
| `--ink`     | `#0E1B1E` | Fond principal (pas de noir pur) |
| `--panel`   | `#14282C` | Surfaces élevées (barres, headers de cartes) |
| `--panel-2` | `#0F2226` | Cartes, terminal, blocs |
| `--line`    | `#234047` | Bordures, séparateurs |
| `--mist`    | `#D8E1DC` | Texte principal |
| `--muted`   | `#8FA39C` | Texte secondaire |
| `--amber`   | `#FFB454` | Accent principal : CTA, tags, highlights |
| `--mint`    | `#5FD3BC` | Accent secondaire : liens, statut "online", data |

Règle : `--amber` = action/identité, `--mint` = données/liens/statut. Ne jamais inverser.

### Typographie (Google Fonts via next/font)
| Rôle    | Fonte           | Poids       | Usage |
|---------|-----------------|-------------|-------|
| Display | Chakra Petch    | 500/600/700 | h1–h3, boutons, logo |
| Body    | IBM Plex Sans   | 400/500/600 | paragraphes |
| Mono    | IBM Plex Mono   | 400/500     | tags, labels, terminal, données, heures |

Échelle : h1 `clamp(34px, 4.6vw, 58px)` · h2 `clamp(26px, 3vw, 38px)` · body 17px · mono labels 12.5–13.5px, letter-spacing .1em+, uppercase.

### Divers
- Border-radius : 4px (boutons/tags), 8px (cartes), 10px (terminal).
- Ombres : uniquement sur le terminal (`0 24px 60px rgba(0,0,0,.45)`).
- Bordures 1px `--line`, hover → `--amber` + `translateY(-4px)`.

## 2. Composants signature à intégrer

### 2.1 Barre HUD (header sticky global)
- Sticky top, fond `rgba(14,27,30,.92)` + backdrop-blur, bordure basse `--line`.
- Contenu : logo `MIKEDEV//NOMAD` (// en amber) · statut "DISPONIBLE" avec dot mint pulsante · heure UTC live (JS, maj 1s) · nav mono uppercase.
- Mobile : masquer UTC + nav (garder logo + statut).

### 2.2 Terminal interactif (hero de la home OU de /pro)
- Fenêtre style macOS (3 dots), titre `mike@field-ops:~`.
- Séquence d'intro auto au chargement (désactivée si `prefers-reduced-motion`).
- Commandes : `help`, `whoami`, `services`, `stack`, `travel`, `contact`, `clear`.
- Référence d'implémentation complète : voir `mikedevnomad-vitrine.html` (à convertir en composant React avec useState/useEffect, PAS de innerHTML direct — utiliser du state + rendu déclaratif).

### 2.3 Fond topographique (hero)
- SVG de courbes de niveau, stroke `#1E363B`, opacité .5, position absolute, pointer-events none.
- Réutiliser le SVG du fichier de référence.

### 2.4 Widget fuseaux horaires
- Bloc mono : Zurich / Bangkok / UTC en live (Intl.DateTimeFormat) + ligne "Réactivité < 24h".

## 3. Adaptation des pages existantes

### Home (split PRO / Nomad) — À CONSERVER tel quel structurellement
- Les deux univers restent. Appliquer le thème :
  - Univers PRO : dominante `--amber`, eyebrow mono `// PRO`, tag `01 / Developer` conservé en mono.
  - Univers Nomad : dominante `--mint`, eyebrow mono `// NOMAD`, drapeaux conservés.
- Ajouter la barre HUD au-dessus.

### /pro
- Intégrer : terminal interactif, cartes services (SEC-01, OPS-02, MON-03, DEV-04), stack en tags mono, méthode 4 étapes (Recon → Plan → Execute → Report).

### /nomade
- Garder le contenu voyage. Appliquer tokens + widget fuseaux horaires. Accent dominant : `--mint`.

## 4. Contraintes techniques
- Next.js : utiliser `next/font/google` pour les 3 fontes (pas de <link> CDN).
- Composants client (`"use client"`) uniquement pour : terminal, horloges, dot pulsante.
- Accessibilité : focus-visible amber 2px, `prefers-reduced-motion` respecté partout, contrastes AA minimum.
- Responsive : breakpoints 600 / 860 / 1000px, grilles 4→2→1 colonnes.
- Aucune dépendance UI externe (pas de lib de composants). CSS Modules ou Tailwind selon l'existant du repo.

## 5. Ordre de migration recommandé
1. Tokens + fontes (globals.css / tailwind.config) — vérifier que rien ne casse.
2. Barre HUD globale (layout).
3. Home split reskinnée.
4. /pro : terminal + services + stack + méthode.
5. /nomade : reskin + widget fuseaux.
6. Passe finale : responsive, reduced-motion, audit Lighthouse.

Une étape = un commit. Vérifier le rendu avant de passer à la suivante.
