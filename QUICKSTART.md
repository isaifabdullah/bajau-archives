# Quick Start Guide - Bajau Archives

## 🎯 5-Minute Setup

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# Visit: http://localhost:3000
```

### Admin Login
- **Password**: `bajauarchives-admin`
- Click any "Upload" or "Add" button to enter admin mode

---

## 🚀 Deploy to Vercel (1 Minute)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Sign up
   - Click "New Project"
   - Select your GitHub repo
   - Click "Deploy"

3. **Done!** Your site is live ✅

---

## 📚 Documentation

- **Full Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Admin Features**: See [Features](#features) below

---

## ✨ Features

### For Visitors
- 🎵 Listen to Sama-Bajau traditional songs
- 📖 Read community stories
- 👥 Learn about the team
- 📜 Understand archiving ethics

### For Admin (Password: `bajauarchives-admin`)
- ⬆️ Upload music files
- 🖼️ Upload story images
- 🗑️ Delete content
- 🔄 Updates go live instantly

---

## 🎨 Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page with intro |
| Repository | `/repository` | Music archive with player |
| Stories | `/stories` | Community narratives |
| Team | `/team` | Project credits |
| Ethics | `/ethics` | Archiving principles |

---

## 🔑 Important

### Before Deploying
**Change the admin password!**

Edit `constants.tsx`:
```typescript
export const ADMIN_KEY = 'your-new-secure-password';
```

Then push to GitHub and redeploy.

### How Files Are Stored
- **Music & Images**: Vercel Blob (cloud storage)
- **Metadata**: Browser localStorage
- **Everything**: Auto-syncs across devices

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| Upload fails | Check file size < 100MB |
| Password wrong | Check ADMIN_KEY in constants.tsx |
| Changes not showing | Hard refresh: Ctrl+Shift+R |
| App won't start | Run `npm install` again |

---

**Questions?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide.

Good luck! 🎉
