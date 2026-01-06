# 📋 Production Checklist

Before deploying to Vercel, run through this checklist:

## Security
- [ ] Change ADMIN_KEY in `constants.tsx` to a strong password
  - Current: `bajauarchives-admin`
  - Should be: Something unique & hard to guess
- [ ] Review authentication logic in Repository.tsx & Stories.tsx
- [ ] Ensure no secrets in code (API keys, tokens, etc.)

## Code Quality
- [ ] Run `npm run build` - no errors?
- [ ] Test locally: `npm run dev`
- [ ] Test admin features:
  - [ ] Upload music file
  - [ ] Upload story image
  - [ ] Delete songs/stories
  - [ ] Search functionality
- [ ] Test mobile responsiveness
  - [ ] Check on phone/tablet
  - [ ] Test on different browsers

## GitHub Setup
- [ ] Create `.gitignore` (already done ✓)
- [ ] Initialize git repo:
  ```bash
  git init
  git add .
  git commit -m "Initial commit - Bajau Archives"
  ```
- [ ] Create GitHub repository
- [ ] Push to GitHub:
  ```bash
  git remote add origin https://github.com/yourusername/bajau-archives.git
  git branch -M main
  git push -u origin main
  ```

## Vercel Deployment
- [ ] Sign up at [vercel.com](https://vercel.com)
- [ ] Connect GitHub account
- [ ] Select your bajau-archives repo
- [ ] Click Deploy
- [ ] Wait for build to complete (~2 min)
- [ ] Visit your live URL

## Post-Deployment Testing
- [ ] Visit your Vercel URL
- [ ] Test all pages load correctly
- [ ] Test admin upload (music/images)
- [ ] Test delete functionality
- [ ] Verify files appear in CDN (fast loading)
- [ ] Check mobile responsiveness

## Optional Customizations
- [ ] Add custom domain (Vercel settings)
- [ ] Change site title/description in index.html
- [ ] Add Google Analytics (optional)
- [ ] Set up custom email for admin alerts (future feature)

## Documentation
- [ ] README.md updated ✓
- [ ] QUICKSTART.md created ✓
- [ ] DEPLOYMENT.md created ✓
- [ ] .github/copilot-instructions.md updated ✓

---

## 🎯 Final Commands

```bash
# Test build
npm run build

# Push to GitHub
git add .
git commit -m "Production ready - ready for Vercel"
git push

# Monitor at: https://vercel.com/dashboard
```

✅ **You're ready to launch!**
