# MikeDevNomad

Portfolio & univers nomade de Mike — développeur, passionné de cybersécurité et grand voyageur.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (design system custom PRO + NOMADE)
- **Keystatic CMS** (gestion blog & photos sans code)

## Structure

```
app/
├── (marketing)/          # Landing page split PRO / NOMADE
├── pro/
│   ├── layout.tsx        # Nav sombre, terminal style
│   ├── page.tsx          # Hub univers pro
│   ├── portfolio/        # Projets
│   ├── cv/               # Curriculum vitae
│   ├── tactical-app/     # Projet phare
│   ├── cybersecurite/    # CTF, write-ups, outils
│   └── contact/          # Formulaire de contact
├── nomade/
│   ├── layout.tsx        # Nav claire, colorée
│   ├── page.tsx          # Hub univers nomade
│   ├── voyages/          # Récits de voyage
│   ├── galerie/          # Photos
│   └── blog/             # Articles
├── keystatic/[[...params]]/  # Admin UI CMS
└── api/keystatic/[...params]/  # API CMS

content/
├── blog/       # Fichiers MDX gérés par Keystatic
└── photos/     # Métadonnées photos gérées par Keystatic

public/
└── images/
    ├── blog/    # Images uploadées via CMS
    └── galerie/ # Photos uploadées via CMS
```

## Commandes

```bash
# Installer les dépendances
npm install

# Lancer en développement (localhost:3000)
npm run dev

# Build de production
npm run build

# Lancer en production
npm start

# Vérification TypeScript
npx tsc --noEmit

# Linter
npm run lint
```

## CMS Keystatic

Pour gérer le blog et les photos **sans toucher au code** :

1. Lancer `npm run dev`
2. Aller sur [http://localhost:3000/keystatic](http://localhost:3000/keystatic)
3. Créer / éditer des articles ou des photos via l'interface graphique

Les fichiers sont sauvegardés localement dans `content/`. Pour la production, configurer Keystatic avec GitHub storage.

## Déploiement

```bash
# Vercel (recommandé)
npx vercel deploy

# Build Docker
docker build -t mikedevnomad .
docker run -p 3000:3000 mikedevnomad
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — split PRO / NOMADE |
| `/pro` | Hub univers pro |
| `/pro/portfolio` | Projets |
| `/pro/cv` | Curriculum vitae |
| `/pro/tactical-app` | TacticalApp |
| `/pro/cybersecurite` | Cybersécurité & CTF |
| `/pro/contact` | Formulaire de contact |
| `/nomade` | Hub univers nomade |
| `/nomade/voyages` | Récits de voyage |
| `/nomade/galerie` | Galerie photos |
| `/nomade/blog` | Blog |
| `/keystatic` | Admin CMS (dev uniquement) |
