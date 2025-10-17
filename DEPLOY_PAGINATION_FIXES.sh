#!/bin/bash

echo "🚀 DEPLOYING PAGINATION & BRANDING FIXES"
echo "========================================"

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

# Add all changes
echo "📝 Adding changes to git..."
git add -A

# Commit with pagination message
echo "💾 Committing pagination and branding improvements..."
git commit -m "🚀 Added pagination & improved branding for Sweden/Norway pages

BRANDING FIXES:
- Removed 'translated news' language throughout
- Changed to 'news in English' for better brand positioning
- Updated descriptions to avoid translation focus

PAGINATION & SEO IMPROVEMENTS:
- Added infinite scroll functionality to Sweden & Norway pages
- Implemented proper pagination with offset support
- Added 'Load More' button fallback for accessibility
- Created /api/articles endpoint with country filtering
- Added loading indicators and article count display
- Better SEO with pagination info for search engines
- Fixed line-clamp CSS warnings

TECHNICAL IMPROVEMENTS:
- Proper API endpoint with Supabase integration
- Infinite scroll detection with 1000px trigger
- 12 articles per page with smooth loading
- Error handling for API failures
- Mobile-friendly pagination controls

These changes improve user experience, SEO, and remove translation branding."

# Push to repository
echo "🚀 Pushing to repository..."
git push

if [ $? -ne 0 ]; then
    echo "❌ Git push failed! Check your repository access."
    exit 1
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
npx netlify-cli deploy --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Pagination & branding fixes deployed!"
    echo "==============================================="
    echo "🎯 KEY IMPROVEMENTS:"
    echo "   • Removed 'translated news' branding throughout"
    echo "   • Added infinite scroll pagination to Sweden/Norway pages"
    echo "   • Created /api/articles endpoint for dynamic loading"
    echo "   • Added proper loading indicators and fallback buttons"
    echo "   • Better SEO with pagination information"
    echo "   • Fixed CSS compatibility warnings"
    echo ""
    echo "📱 USER EXPERIENCE:"
    echo "   • Smooth infinite scroll on mobile and desktop"
    echo "   • Load more button for non-JS users"
    echo "   • Article count display for transparency"
    echo "   • Better brand positioning without translation focus"
    echo ""
    echo "🎉 PAGES NOW LOAD PROPERLY WITH PAGINATION!"
    echo "==============================================="
else
    echo "❌ Netlify deployment failed! Check your Netlify configuration."
    exit 1
fi
