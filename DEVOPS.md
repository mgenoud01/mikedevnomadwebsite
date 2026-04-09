# DevOps — mikedevnomad.com

## Table of contents
1. [Git workflow](#git-workflow)
2. [Environment variables](#environment-variables)
3. [CI/CD — GitHub Actions](#cicd--github-actions)
4. [Deploy on Vercel](#option-a--vercel-recommended-for-read-only-site)
5. [Deploy on VPS with Docker](#option-b--vps--docker-recommended-for-admin)
6. [Update the site](#update-the-site)

---

## Git workflow

### First-time setup (already done)
```bash
git remote add origin https://github.com/mgenoud01/website_MikeDevNomad.git
git branch -M main
git push -u origin main
```

### Daily workflow
```bash
# 1. Check what changed
git status

# 2. Stage your changes
git add -A                        # all files
git add app/pro/page.tsx          # specific file

# 3. Commit
git commit -m "feat: add new trip to Japan"

# 4. Push to GitHub
git push origin main
```

### Common commands
```bash
git log --oneline -10             # last 10 commits
git diff                          # see unstaged changes
git diff --staged                 # see staged changes
git restore app/pro/page.tsx      # undo changes on a file
git pull origin main              # pull latest from GitHub
```

### Branch workflow (for big features)
```bash
git checkout -b feat/contact-page  # create & switch branch
git push origin feat/contact-page  # push branch
# → open a Pull Request on GitHub
# → merge into main
git checkout main && git pull      # back to main
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
- **Vercel**: Project Settings → Environment Variables
- **VPS**: create a `.env.local` file on the server (or set in `docker-compose.yml`)
- **GitHub Actions secrets**: Settings → Secrets and variables → Actions
  - `ADMIN_PASSWORD`
  - `ADMIN_SECRET`
  - `CLOUDINARY_UPLOAD_PRESET`

---

## CI/CD — GitHub Actions

The workflow at `.github/workflows/ci.yml` runs automatically on every push to `main`:
1. Installs dependencies
2. Type-checks TypeScript
3. Builds the app

**Setup**: go to your repo on GitHub → Settings → Secrets and variables → Actions → add the 3 secrets above.

---

## Option A — Vercel (recommended for read-only site)

Best for: fast CDN, zero maintenance, free tier.

**Limitation**: the admin panel can write to JSON files locally, but on Vercel the filesystem is read-only. Data changes made in the admin won't persist after redeployment. Use this option if you commit your data to git and don't need the live admin.

### Steps
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import `github.com/mgenoud01/website_MikeDevNomad`
3. Add environment variables:
   - `ADMIN_PASSWORD`
   - `ADMIN_SECRET`
   - `CLOUDINARY_UPLOAD_PRESET`
4. Click **Deploy**

Every `git push origin main` will trigger an automatic redeployment.

### Custom domain
Vercel Dashboard → Project → Settings → Domains → add `mikedevnomad.com`

Then in your DNS registrar:
```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

---

## Option B — VPS + Docker (recommended for admin)

Best for: full admin functionality with persistent data (voyages, photos, etc.).

Recommended providers: **Hetzner** (CX21 ~4€/month), DigitalOcean, OVH.

### Server setup (Ubuntu 22.04)
```bash
# Connect to your server
ssh root@YOUR_SERVER_IP

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Nginx (reverse proxy)
apt install nginx certbot python3-certbot-nginx -y

# Clone your repo
git clone https://github.com/mgenoud01/website_MikeDevNomad.git /app
cd /app/mikedevnomad

# Create .env.local
cat > .env.local << EOF
ADMIN_PASSWORD=your_password_here
ADMIN_SECRET=a_random_secret_string
CLOUDINARY_UPLOAD_PRESET=mikedevnomad
EOF
```

### Start the app
```bash
# Build and start
docker compose up -d --build

# Check it's running
docker compose ps
docker compose logs -f
```

### Nginx reverse proxy config
```nginx
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

# HTTPS with Let's Encrypt (free SSL)
certbot --nginx -d mikedevnomad.com -d www.mikedevnomad.com
```

### DNS setup
In your domain registrar:
```
A    @    YOUR_SERVER_IP
A    www  YOUR_SERVER_IP
```

---

## Update the site

### With Vercel (automatic)
```bash
git add -A
git commit -m "update: new trip added"
git push origin main
# → Vercel redeploys automatically in ~1 min
```

### With VPS + Docker
```bash
# On your local machine
git add -A && git commit -m "update: ..." && git push origin main

# On the server
ssh root@YOUR_SERVER_IP
cd /app/mikedevnomad
git pull origin main
docker compose up -d --build
```

### Auto-deploy on VPS (optional)
Add this to `.github/workflows/ci.yml` to deploy automatically on push:
```yaml
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: root
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /app/mikedevnomad
            git pull origin main
            docker compose up -d --build
```
Add `VPS_HOST` and `VPS_SSH_KEY` to GitHub secrets.

---

## Quick reference

| Action | Command |
|--------|---------|
| Start local dev | `npm run dev` |
| Build locally | `npm run build` |
| Check types | `npx tsc --noEmit` |
| Push to GitHub | `git add -A && git commit -m "..." && git push` |
| Start Docker | `docker compose up -d --build` |
| View Docker logs | `docker compose logs -f` |
| Stop Docker | `docker compose down` |
