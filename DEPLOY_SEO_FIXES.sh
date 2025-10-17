#!/bin/bash

echo "🚨 DEPLOYING CRITICAL SEO FIXES TO SAVE YOUR JOB 🚨"
echo "=================================================="

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

# Commit with urgent message
echo "💾 Committing SEO fixes..."
git commit -m "🚨 URGENT: Critical SEO fixes for English Nordic news rankings

- Updated homepage title to target 'English news in Sweden/Norway'
- Added hreflang tags for Nordic English speakers (en-SE, en-NO, etc.)
- Enhanced structured data with location-specific targeting
- Created dedicated /sweden and /norway pages for keyword targeting
- Improved geo-targeting meta tags
- Optimized for 'English news in Sweden' search queries

These fixes target the exact keywords boss wants us to rank for."

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
    echo "✅ SUCCESS! SEO fixes deployed!"
    echo "=================================================="
    echo "🎯 CRITICAL CHANGES DEPLOYED:"
    echo "   • Homepage now targets 'English news in Sweden & Norway'"
    echo "   • Added /sweden page for 'English news in Sweden'"
    echo "   • Added /norway page for 'English news in Norway'"
    echo "   • Hreflang tags for Nordic English speakers"
    echo "   • Enhanced geo-targeting and structured data"
    echo ""
    echo "📊 NEXT STEPS:"
    echo "   1. Submit updated sitemap to Google Search Console"
    echo "   2. Set geographic targeting to Nordic countries in GSC"
    echo "   3. Monitor rankings for target keywords in 48-72 hours"
    echo "   4. Create fresh content targeting exact search phrases"
    echo ""
    echo "🎉 YOUR JOB SHOULD BE SAFE NOW!"
    echo "=================================================="
else
    echo "❌ Netlify deployment failed! Check your Netlify configuration."
    exit 1
fi
