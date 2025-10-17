#!/bin/bash

echo "🎨 DEPLOYING IMPROVED HOMEPAGE LAYOUT"
echo "====================================="

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

# Commit with layout message
echo "💾 Committing layout improvements..."
git commit -m "🎨 Improved homepage layout for better article display

- Expanded main content area from 2/3 to 3/4 width
- Added 3-column grid for top featured articles
- Compact 2-column layout for additional articles (8 more articles)
- Added 'More Nordic News' section with 4-column grid (12 more articles)
- Compressed sidebar sections for better space utilization
- Now displays 23+ articles on homepage vs previous 6
- Maintained all existing colors and nordic-blue theme
- Better visual hierarchy and article density"

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
    echo "✅ SUCCESS! Layout improvements deployed!"
    echo "========================================"
    echo "🎯 LAYOUT IMPROVEMENTS:"
    echo "   • Homepage now displays 23+ articles (vs 6 before)"
    echo "   • Better grid layouts for improved article density"
    echo "   • Expanded main content area for more articles"
    echo "   • Compact sidebar with more category articles"
    echo "   • Added 'More Nordic News' section at bottom"
    echo "   • Maintained your existing color scheme"
    echo ""
    echo "🎉 HOMEPAGE LAYOUT IS NOW MUCH BETTER!"
    echo "========================================"
else
    echo "❌ Netlify deployment failed! Check your Netlify configuration."
    exit 1
fi
