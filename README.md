# MikeDevNomad

Portfolio & travel universe of Mike — developer, cybersecurity enthusiast, and digital nomad.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Cloudinary** (image hosting, organized by trip folder)
- **JSON file storage** (`data/*.json`) — persisted via Docker volume
- **Cookie-based auth** — admin panel protected

## Local development

```bash
# Install dependencies
npm install

# Start dev server (localhost:3000)
npm run dev

# Type check
npx tsc --noEmit

# Production build
npm run build
```

Create a `.env.local` file at the root:

```env
ADMIN_PASSWORD=your_password_here
ADMIN_SECRET=a_random_secret_string
CLOUDINARY_UPLOAD_PRESET=mikedevnomad
```

## Push to GitHub + Azure DevOps after every change

> Both platforms must be kept in sync. Always push to both.

```bash
# 1. Stage your changes
git add -A

# 2. Commit
git commit -m "feat: describe your change"

# 3. Push to BOTH platforms
git push origin main && git push azure main
```

Push to one only if needed:

```bash
git push origin main   # GitHub only
git push azure main    # Azure DevOps only
```

This triggers:
- **GitHub Actions** → CI (type check + build)
- **Azure DevOps** → CI (type check + build + artifact)
- **Vercel** → automatic redeployment (if connected)

## Project structure

```
app/
├── pro/              # PRO universe (dark navy, developer portfolio)
│   ├── portfolio/    # Projects
│   ├── cv/           # Resume & experiences
│   ├── cybersecurite/# CTF, write-ups
│   └── contact/      # Contact form
├── nomade/           # NOMADE universe (travel blog)
│   ├── voyages/      # Trip pages with gallery
│   ├── galerie/      # Photo gallery with albums
│   └── blog/         # Articles
├── admin/            # Admin panel (password protected)
│   ├── voyages/
│   ├── blog/
│   ├── galerie/
│   └── pro/          # Projects, resume, CTF, profile
└── api/admin/        # REST API for admin CRUD

data/                 # JSON storage (persisted via Docker volume)
├── voyages.json
├── articles.json
├── galerie.json
├── projects.json
├── experiences.json
├── ctf.json
└── proProfile.json
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — PRO / NOMADE split |
| `/pro` | PRO hub |
| `/pro/portfolio` | Projects |
| `/pro/cv` | Resume |
| `/pro/cybersecurite` | Cybersecurity & CTF |
| `/pro/contact` | Contact |
| `/nomade` | NOMADE hub |
| `/nomade/voyages` | Trip list |
| `/nomade/voyages/[slug]` | Trip detail + gallery |
| `/nomade/galerie` | Photo gallery by album |
| `/nomade/blog` | Blog |
| `/admin` | Admin panel |

## Deployment

See [DEVOPS.md](./DEVOPS.md) for full deployment guide (Vercel, VPS+Docker, CI/CD setup).
