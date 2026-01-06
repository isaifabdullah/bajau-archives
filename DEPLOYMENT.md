# Bajau Archives - Deployment Guide

## 🚀 Getting Started (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/bajau-archives.git
cd bajau-archives
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Visit: `http://localhost:3000`

### 3. Admin Access
- **Password**: `bajauarchives-admin`
- Navigate to Repository or Stories page
- Click "Upload" button to add content

---

## 🌐 Deploy to Vercel (Live Website)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit - Bajau Archives"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Connect GitHub → Select `bajau-archives` repo
5. Click **"Deploy"**

**That's it!** Your site is live at `https://bajau-archives.vercel.app` (or custom domain)

### Step 3: Vercel Blob Storage Setup
Vercel automatically enables Blob storage for free tier:
- When you upload music/images, they go to Vercel Blob
- Each file gets a CDN URL automatically
- No additional configuration needed

---

## 📁 Project Structure

```
bajau-archives/
├── src/
│   ├── pages/             # Route pages (Home, Repository, Stories, etc.)
│   ├── components/        # Reusable components (Navbar, ScrollToTop)
│   ├── services/
│   │   ├── dataService.ts # localStorage CRUD for songs/stories
│   │   └── blobService.ts # Vercel Blob upload/delete
│   ├── App.tsx            # Router setup
│   ├── types.ts           # TypeScript interfaces
│   └── constants.tsx      # Mock data & auth keys
├── api/
│   └── upload-music.ts    # Vercel serverless function for Blob
├── .github/
│   └── copilot-instructions.md
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔐 Security & Admin Features

### Authentication
- **Admin Password**: Set in `constants.tsx` (ADMIN_KEY)
- Currently: `bajauarchives-admin` - **Change this before deploying!**

### Changing Admin Password
Edit `constants.tsx`:
```typescript
export const ADMIN_KEY = 'your-secure-password-here';
```

### Features (Admin Only)
- ✅ Upload music files (stored in Vercel Blob)
- ✅ Upload story images (stored in Vercel Blob)
- ✅ Delete songs/stories permanently
- ✅ Add new content in real-time

---

## 📊 Data Flow

```
User uploads music/image
         ↓
Browser sends to /api/upload-music
         ↓
Vercel Blob stores file, returns URL
         ↓
App saves metadata (title, URL) to localStorage
         ↓
Data persists in browser + Vercel Blob
```

---

## 🛠️ Maintenance & Updates

### Add New Song
1. Login as admin (`bajauarchives-admin`)
2. Click "Upload Music" in Repository
3. Select file → Fill details → Save
4. Appears instantly on site

### Add New Story
1. Login as admin
2. Click "Submit New Story" in Stories
3. Upload image → Fill content → Publish
4. Goes live immediately

### Delete Content
1. Admin login
2. Click "Remove Article" / Delete button
3. Confirmation → Deleted from site & Blob storage

---

## 🔧 Environment Variables

**Automatically handled by Vercel:**
- `BLOB_READ_WRITE_TOKEN` - Set in Vercel dashboard (optional)

**No manual env setup needed** - Vercel manages everything!

---

## 📱 Features

✅ **Dark theme** with teal accents  
✅ **Mobile responsive** design  
✅ **Audio player** with playback controls  
✅ **Search functionality** for songs  
✅ **Real-time uploads** to Vercel Blob  
✅ **Admin dashboard** for content management  
✅ **Newspaper-style** story layouts  
✅ **Team & Ethics** pages  

---

## 🚨 Troubleshooting

### File Upload Fails
- Check Vercel Blob is enabled in Vercel dashboard
- Ensure file size < 100MB
- Check browser console for errors

### Changes Not Showing
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache

### Admin Password Wrong
- Password is case-sensitive
- Check `constants.tsx` ADMIN_KEY value

---

## 📝 Making Changes

1. **Edit code locally**
   ```bash
   npm run dev
   ```

2. **Test changes**
   - Visit `http://localhost:3000`
   - Try upload/delete as admin

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

4. **Auto-deploy to Vercel**
   - Vercel watches GitHub
   - Changes deploy automatically in ~1-2 minutes

---

## 📞 Support

For issues:
1. Check browser DevTools Console (F12)
2. Check Vercel dashboard logs
3. Review error messages in app

---

**Ready to go live!** 🎉
