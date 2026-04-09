# DevOps — mikedevnomad.com

## Table of contents
1. [Repositories](#repositories)
2. [Git workflow](#git-workflow)
3. [Environment variables](#environment-variables)
4. [CI/CD — GitHub Actions](#cicd--github-actions)
5. [CI/CD — Azure DevOps](#cicd--azure-devops)
6. [Deploy on Vercel](#option-a--vercel-recommended-for-read-only-site)
7. [Deploy on VPS with Docker](#option-b--vps--docker-recommended-for-admin)
8. [Update the site](#update-the-site)

---

## Repositories

The code is mirrored on two platforms simultaneously.

| Platform | URL |
|----------|-----|
| **GitHub** | https://github.com/mgenoud01/website_MikeDevNomad |
| **Azure DevOps** | https://dev.azure.com/ITmikedecouverte/WebSite_MIkeDevNomad |

```bash
# Check configured remotes
git remote -v

# Expected output:
# azure   https://ITmikedecouverte@dev.azure.com/ITmikedecouverte/WebSite_MIkeDevNomad/_git/WebSite_MIkeDevNomad
# origin  https://github.com/mgenoud01/website_MikeDevNomad.git
```

---

## Git workflow

### First-time setup (already done)
```bash
# GitHub remote
git remote add origin https://github.com/mgenoud01/website_MikeDevNomad.git

# Azure DevOps remote
git remote add azure https://ITmikedecouverte@dev.azure.com/ITmikedecouverte/WebSite_MIkeDevNomad/_git/WebSite_MIkeDevNomad

git branch -M main
git push -u origin main
git push -u azure main
```

### Daily workflow — push to both
```bash
# 1. Stage your changes
git add -A

# 2. Commit
git commit -m "feat: description of change"

# 3. Push to BOTH platforms
git push origin main && git push azure main
```

### Push to one platform only
```bash
git push origin main   # GitHub only
git push azure main    # Azure DevOps only
```

### Other useful commands
```bash
git status                        # what changed
git log --oneline -10             # last 10 commits
git diff                          # unstaged changes
git diff --staged                 # staged changes
git restore app/pro/page.tsx      # undo changes on a file
git pull origin main              # pull latest from GitHub
```

### Branch workflow (for big features)
```bash
git checkout -b feat/contact-page       # create & switch branch
git push origin feat/contact-page       # push to GitHub
git push azure feat/contact-page        # push to Azure DevOps
# → open a Pull Request on GitHub / Azure DevOps
# → merge into main
git checkout main && git pull origin main
```

---

## Environment variables

Never commit `.env.local` — it's already in `.gitignore`.

### Local (`.env.local`)
```env
ADMIN_PASSWORD=your_password_here
ADMIN_SECRET=a_random_secret_string
CLOUDINARY_UPLOAD_PRESET=mikedevnomad
```

### Where to set them for deployment

**GitHub Actions** — Settings → Secrets and variables → Actions:
- `ADMIN_PASSWORD`
- `ADMIN_SECRET`
- `CLOUDINARY_UPLOAD_PRESET`

**Azure DevOps** — Pipelines → Library → Variable Group `mikedevnomad`:
- `ADMIN_PASSWORD` (mark as secret 🔒)
- `ADMIN_SECRET` (mark as secret 🔒)
- `CLOUDINARY_UPLOAD_PRESET`

**Vercel** — Project Settings → Environment Variables

**VPS** — `.env.local` file on the server

---

## CI/CD — GitHub Actions

File: `.github/workflows/ci.yml`

**Triggers**: every push or PR on `main`

**Steps**:
1. Install dependencies
2. TypeScript type check
3. Build Next.js app

**Setup**:
→ github.com/mgenoud01/website_MikeDevNomad → Settings → Secrets → add the 3 variables above.

---

## CI/CD — Azure DevOps

File: `azure-pipelines.yml`

**Triggers**: every push on `main`

**Steps**:
1. Install dependencies
2. TypeScript type check
3. Build Next.js app
4. Publish build artifact

### Setup on Azure DevOps
1. Go to [dev.azure.com/ITmikedecouverte](https://dev.azure.com/ITmikedecouverte)
2. Project `WebSite_MIkeDevNomad` → **Pipelines** → New Pipeline
3. Select **Azure Repos Git** → select `WebSite_MIkeDevNomad`
4. Select **Existing Azure Pipelines YAML file** → `/azure-pipelines.yml`
5. Add variables: Pipelines → **Library** → + Variable group
   - Name: `mikedevnomad`
   - Add `ADMIN_PASSWORD`, `ADMIN_SECRET`, `CLOUDINARY_UPLOAD_PRESET`
6. Run the pipeline

### Personal Access Token (PAT)
When pushing to Azure DevOps for the first time, Git will ask for a password.
Use a **PAT** instead of your Microsoft password:
1. dev.azure.com → User Settings (top right) → Personal Access Tokens
2. New Token → Name: `git-push` → Scopes: **Code (Read & Write)**
3. Copy the token → use it as your Git password

---

## Option A — Vercel (recommended for read-only site)

Best for: fast CDN, zero maintenance, free tier.

> ⚠️ **Limitation**: on Vercel the filesystem is read-only. The admin panel works but data written (voyages, articles, etc.) won't persist after redeployment. Use Vercel if you commit your data to git before deploying.

### Steps
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import `github.com/mgenoud01/website_MikeDevNomad`
3. Add environment variables:
   - `ADMIN_PASSWORD`
   - `ADMIN_SECRET`
   - `CLOUDINARY_UPLOAD_PRESET`
4. Click **Deploy**

Every `git push origin main` triggers an automatic redeployment (~1 min).

### Custom domain
Vercel Dashboard → Project → Settings → Domains → add `mikedevnomad.com`

DNS records:
```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

---

## Option B — VPS + Docker (recommended for admin)

Best for: full admin functionality with persistent data.

Recommended: **Hetzner CX21** (~4€/month), DigitalOcean, OVH.

### Server setup (Ubuntu 22.04)
```bash
# Connect to server
ssh root@YOUR_SERVER_IP

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Nginx
apt install nginx certbot python3-certbot-nginx -y

# Clone repo
git clone https://github.com/mgenoud01/website_MikeDevNomad.git /app
cd /app/mikedevnomad

# Create environment file
cat > .env.local << EOF
ADMIN_PASSWORD=your_password_here
ADMIN_SECRET=a_random_secret_string
CLOUDINARY_UPLOAD_PRESET=mikedevnomad
EOF
```

### Start the app
```bash
docker compose up -d --build

# Check status
docker compose ps
docker compose logs -f
```

### Nginx config
```bash
# /etc/nginx/sites-available/mikedevnomad
server {
    server_name mikedevnomad.com www.mikedevnomad.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/mikedevnomad /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Free HTTPS
certbot --nginx -d mikedevnomad.com -d www.mikedevnomad.com
```

### DNS
```
A    @    YOUR_SERVER_IP
A    www  YOUR_SERVER_IP
```

### Auto-deploy from Azure DevOps
Add a release pipeline in Azure DevOps:
1. Pipelines → **Releases** → New pipeline
2. Add artifact: the build from the CI pipeline
3. Add stage: **Deploy to VPS**
4. Add task: **SSH** → run:
```bash
cd /app/mikedevnomad && git pull origin main && docker compose up -d --build
```

---

## Update the site

### Standard (push to both + auto-redeploy)
```bash
git add -A
git commit -m "update: description"
git push origin main && git push azure main
# → GitHub Actions runs CI
# → Azure DevOps pipeline runs CI
# → Vercel redeploys automatically (if using Vercel)
```

### Manual update on VPS
```bash
ssh root@YOUR_SERVER_IP
cd /app/mikedevnomad
git pull origin main
docker compose up -d --build
```

---

## Quick reference

| Action | Command |
|--------|---------|
| Start local dev | `npm run dev` |
| Build locally | `npm run build` |
| Check types | `npx tsc --noEmit` |
| Push to GitHub | `git push origin main` |
| Push to Azure DevOps | `git push azure main` |
| Push to both | `git push origin main && git push azure main` |
| Start Docker | `docker compose up -d --build` |
| View Docker logs | `docker compose logs -f` |
| Stop Docker | `docker compose down` |
