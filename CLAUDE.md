# CLAUDE.md — Règles du projet mikedevnomad.com

## Contexte
Site vitrine freelance Next.js (App Router) + Tailwind + Sanity/Keystatic.
Déploiement : Docker + Azure Pipelines.
Migration en cours vers le design system "Field Ops" (voir DESIGN-SYSTEM.md).

## Règles permanentes
- NE JAMAIS toucher : sanity/, keystatic.config.ts, azure-pipelines.yml, Dockerfile, docker-compose.yml.
- NE JAMAIS installer de nouvelle dépendance npm sans me demander.
- Ne pas modifier les routes existantes (/, /pro, /nomade) ni la logique de fetch du contenu.
- Tokens design : dans tailwind.config.ts (theme.extend). Fontes : next/font/google dans app/layout.tsx.
- Composants interactifs (Terminal, horloges) : "use client", state React déclaratif, pas de innerHTML.
- Accessibilité : prefers-reduced-motion respecté, focus-visible, contrastes AA.

## Workflow
- Travailler étape par étape selon l'ordre de DESIGN-SYSTEM.md (section 5).
- Montrer le diff et attendre ma validation avant chaque étape suivante.
- Après chaque étape : vérifier que `npm run build` passe.
- Un commit par étape, message clair en français (ex: "design: tokens + fontes Field Ops").

## Design system (résumé)
- Fond #0E1B1E, panneaux #14282C / #0F2226, bordures #234047.
- Texte #D8E1DC, secondaire #8FA39C.
- Accent principal amber #FFB454 (CTA, univers PRO), secondaire mint #5FD3BC (liens, statut, univers NOMAD).
- Fontes : Chakra Petch (display), IBM Plex Sans (body), IBM Plex Mono (labels/data/terminal).
- Détails complets et composants signature : DESIGN-SYSTEM.md + mikedevnomad-vitrine.html (référence).
