# Workflow — Update the site

## 1. Start local dev server

```bash
cd mikedevnomad
npm run dev
```

Go to `http://localhost:3000` to see the site locally.

---

## 2. Make your changes

### Update content (voyages, articles, gallery, PRO profile)
Go to `http://localhost:3000/admin` and fill in your content.
Everything is saved in `data/*.json` files on your machine.

### Update the code
Edit the files directly in your editor.

---

## 3. Check everything looks good

Open `http://localhost:3000` and navigate through the site to verify.

---

## 4. Push to GitHub + Azure DevOps

```bash
# Stage all changes (code + data)
git add -A

# Commit with a description
git commit -m "content: describe what you changed"

# Push to both platforms
git push origin main && git push azure main
```

---

## 5. Site is updated automatically

As soon as you push:
- **Vercel** redeploys automatically → `mikedevnomad.com` is updated in ~1 min
- **GitHub Actions** runs CI (type check + build)
- **Azure DevOps** runs CI (type check + build + artifact)

---

## Important note

On Vercel the filesystem is **read-only**. If you add content via the admin panel on the **live site**, it will disappear after the next deployment.

**Always edit locally → then push.**

---

## Quick reference

| Action | Command |
|--------|---------|
| Start local dev | `npm run dev` |
| Admin panel | `localhost:3000/admin` |
| Stage changes | `git add -A` |
| Commit | `git commit -m "description"` |
| Push to both | `git push origin main && git push azure main` |
| Check live site | `mikedevnomad.com` |
