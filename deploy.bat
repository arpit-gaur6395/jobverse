@echo off
echo ========================================
echo 🚀 DEPLOYING JOB PORTAL TO VERCEL
echo ========================================
echo.

echo Step 1: Installing Vercel CLI...
call npm install -g vercel

echo.
echo Step 2: Logging into Vercel...
call vercel login

echo.
echo Step 3: Deploying project...
call vercel

echo.
echo ========================================
echo ✅ DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your Job Portal is now live! 🎉
echo Check your Vercel dashboard for the deployment URL.
echo.
echo Next steps:
echo 1. Set up environment variables in Vercel dashboard
echo 2. Test your application
echo 3. Share your live URL!
echo.
pause
