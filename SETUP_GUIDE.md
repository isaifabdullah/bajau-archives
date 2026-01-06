# 🎬 Step-by-Step: From Code to Live Website

## Phase 1: Local Setup & Testing (5 minutes)

### Step 1: Verify Everything Works Locally
```bash
cd bajau-archives
npm install
npm run dev
```
- Open `http://localhost:3000`
- Should see home page with "Repository", "Stories", etc.

### Step 2: Test Admin Features
- Go to **Repository** page
- Click **"Contributor Access"** button
- Enter password: `bajauarchives-admin`
- Should see "Upload Music" button

### Step 3: Test Upload
- Click "Upload Music"
- Select an MP3 file from your computer
- Fill in: Title, Genre, Performer, Description
- Click "Save to Archive"
- ✅ Should appear in the list

### Step 4: Change Admin Password (IMPORTANT!)
Edit `constants.tsx`:
```typescript
export const ADMIN_KEY = 'your-new-secure-password-here';
```
⚠️ **DO THIS BEFORE DEPLOYING!**

---

## Phase 2: Push to GitHub (10 minutes)

### Step 5: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Sign in / Sign up
3. Click **"New repository"**
4. Name: `bajau-archives`
5. Description: `Digital heritage archive for Sama-Bajau maritime culture`
6. **Public** (so others can see it)
7. Don't initialize with README (we have one)
8. Click **"Create repository"**

### Step 6: Push Your Code
In your terminal:
```bash
cd bajau-archives
git init
git add .
git commit -m "Initial commit - Bajau Archives digital heritage platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/bajau-archives.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

✅ Your code is now on GitHub!

---

## Phase 3: Deploy to Vercel (5 minutes)

### Step 7: Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose: **"Continue with GitHub"**
4. Authorize Vercel to access GitHub
5. Done!

### Step 8: Deploy Your Project
1. You'll see a **"Import Project"** button
2. Click it
3. Paste your GitHub repo URL:
   ```
   https://github.com/YOUR-USERNAME/bajau-archives
   ```
4. Click **"Import"**
5. Settings page appears (leave defaults)
6. Click **"Deploy"**
7. **Wait 1-2 minutes** for deployment ⏳

### Step 9: Your Site is Live! 🎉
- Vercel gives you a URL like: `https://bajau-archives-xyz.vercel.app`
- This is your **live website**
- Share this link with anyone!

---

## Phase 4: Post-Launch Testing (5 minutes)

### Step 10: Test Live Site
1. Visit your Vercel URL
2. Check all pages load:
   - ✅ Home
   - ✅ Repository
   - ✅ Stories
   - ✅ Team
   - ✅ Ethics

### Step 11: Test Admin on Live Site
1. Go to Repository page on **your live URL**
2. Click "Contributor Access"
3. Enter your **new password** (from Step 4)
4. Try uploading a test music file
5. ✅ Should upload to Vercel Blob instantly!

### Step 12: Get Vercel Blob Token (Optional Advanced)
If you want to manage Blob storage limits:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Storage → Blob**
4. Copy the token if needed
5. (Usually not needed for basic usage)

---

## 📱 How It Works Now

```
Your Computer
     ↓
  (Git)
     ↓
GitHub Repository
     ↓
  (Auto watches)
     ↓
Vercel Deployment
     ↓
Live Website (https://your-domain.vercel.app)
```

When you **push to GitHub**, Vercel **automatically redeploys** in ~1-2 minutes!

---

## 🔄 Making Updates Later

### To Add New Songs/Stories:
1. Visit your live URL
2. Login with admin password
3. Upload music/images
4. Goes live instantly ✅

### To Update Code:
1. Edit files locally
2. Test with `npm run dev`
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
4. Vercel auto-redeploys
5. Changes live in 1-2 minutes

---

## 🎨 Optional: Custom Domain

Instead of `bajau-archives-xyz.vercel.app`, use your own domain:

1. Buy a domain from:
   - [namecheap.com](https://namecheap.com)
   - [godaddy.com](https://godaddy.com)
   - [google.com/domains](https://google.com/domains)

2. In Vercel dashboard:
   - Project Settings → Domains
   - Add your custom domain
   - Vercel shows DNS instructions
   - Follow them in your domain provider

3. Wait 24 hours for DNS to propagate
4. Your site lives at `yourdomain.com` 🎉

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Vercel says "Build failed"** | Check build log for errors. Usually missing dependencies. Run `npm install` again. |
| **Upload not working** | Check browser console (F12). Verify Vercel Blob is enabled in project settings. |
| **Changes not showing on live site** | Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac). Wait for Vercel to redeploy. |
| **Can't remember admin password** | Edit `constants.tsx`, set new password, push to GitHub, redeploy. |
| **Files too large** | Max 100MB per file. Use lower quality MP3s (128kbps). |

---

## 📊 Monitor Your Site

**Vercel Dashboard** (https://vercel.com/dashboard):
- ✅ View deployments
- ✅ Check build logs
- ✅ Monitor traffic
- ✅ View Blob storage usage
- ✅ Set up custom domain

---

## 🎓 Summary of URLs

| What | URL |
|------|-----|
| **Local Dev** | http://localhost:3000 |
| **GitHub Code** | https://github.com/YOUR-USERNAME/bajau-archives |
| **Live Website** | https://bajau-archives-xyz.vercel.app |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Blob Storage** | (Managed in Vercel) |

---

## 🎉 You're Done!

Your Bajau Archives site is now:
- ✅ Live on the internet
- ✅ Accessible from anywhere
- ✅ Connected to GitHub
- ✅ Using Vercel for hosting
- ✅ Using Vercel Blob for file storage
- ✅ Ready for admin uploads

**Congratulations!** 🌟

---

## 💡 Next Steps

- Invite others to explore your site
- Share the link on social media
- Monitor uploads in admin dashboard
- Plan content calendar for new songs/stories
- Consider backing up important files
