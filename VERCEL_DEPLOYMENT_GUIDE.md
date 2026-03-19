# 🚀 Vercel Deployment Guide

## ✅ Your Project is Ready for Vercel!

Your project structure and configuration are already optimized for Vercel deployment.

## 📋 Deployment Steps:

### 1. **Install Vercel CLI**
```bash
npm i -g vercel
```

### 2. **Login to Vercel**
```bash
vercel login
```

### 3. **Deploy from Project Root**
```bash
cd c:\Users\91639\Desktop\JobPortalFullStack
vercel
```

### 4. **Follow the Prompts**
- **Vercel will detect:**
  - ✅ React frontend (in `frontend/` folder)
  - ✅ Node.js backend (in `Backend/api-server.js`)
  - ✅ Proper routing configuration

## 🔧 Configuration Already Done:

### ✅ vercel.json is Perfect:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "Backend/api-server.js",  ← ✅ Backend serverless
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",   ← ✅ Frontend build
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",              ← ✅ API routes
      "dest": "/Backend/api-server.js"
    },
    {
      "src": "/(.*)",                 ← ✅ Frontend routes
      "dest": "/frontend/$1"
    }
  ]
}
```

## 🔐 Environment Variables Setup:

### **In Vercel Dashboard:**
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add these variables:

```
MONGO_URI = mongodb+srv://arpitgaur005:<your_password>@cluster0.lvhieie.mongodb.net/jobportal
JWT_SECRET = yourSuperSecretKey123
NODE_ENV = production
```

### **Replace `<your_password>`** with your actual MongoDB password

## 🌐 Deployment URLs:

After deployment, you'll get:
- **Frontend**: `https://your-app.vercel.app`
- **API Endpoints**: `https://your-app.vercel.app/api/*`

## 🧪 Testing After Deployment:

### **Test API:**
```bash
# Test health endpoint
curl https://your-app.vercel.app/api/auth/verify

# Test jobs endpoint
curl https://your-app.vercel.app/api/jobs
```

### **Test Frontend:**
- Visit `https://your-app.vercel.app`
- Test login, registration, job browsing

## 🔄 Auto-Deploy Setup:

### **Connect GitHub Repository:**
1. In Vercel dashboard: "Add New Project"
2. Import your GitHub repository
3. Vercel will auto-deploy on every push to main branch

## 🚨 Common Issues & Solutions:

### **Issue 1: API Not Working**
- **Solution**: Check environment variables in Vercel dashboard
- **Make sure**: MONGO_URI is correct and accessible

### **Issue 2: Frontend Not Loading**
- **Solution**: Check build logs in Vercel dashboard
- **Make sure**: All frontend dependencies are installed

### **Issue 3: CORS Errors**
- **Solution**: Backend should handle CORS (already configured)
- **Check**: Backend/api-server.js has cors middleware

## 📱 Mobile & SEO:

Your app will be:
- ✅ Mobile responsive
- ✅ SEO friendly
- ✅ Fast loading
- ✅ Production ready

## 🎉 You're Ready!

**Your project is 100% configured for Vercel deployment!**

Just run:
```bash
vercel
```

And follow the prompts. Your Job Portal will be live in minutes! 🚀
