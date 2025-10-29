# City Pages Enhancement Summary

## ✅ Completed: Stockholm (`/stockholm`)

Stockholm now has the full pillar page structure:
- **FAQ Schema** with 4 city-specific questions
- **Category Modules**: Politics, Business, Tech, Society (4 articles each)
- **Enhanced SEO** with breadcrumb navigation
- **Internal linking** to /sweden and other cities
- **413 lines** of optimized content

## 🔄 Pending: Gothenburg & Malmö

Both Gothenburg and Malmö pages need the same enhancements. They currently have:
- Basic article listing (212 lines)
- Simple SEO
- No category modules
- No FAQ sections

### What They Need:

#### 1. FAQ Schema (add to structuredData)
**Gothenburg FAQs:**
- "Where can I read Gothenburg news in English?"
- "What makes Gothenburg important for Swedish business?"
- "Does Gothenburg have English news coverage?"
- "Can expats follow Gothenburg local news?"

**Malmö FAQs:**
- "Where can I read Malmö news in English?"
- "What is the Öresund region?"
- "Does Malmö have English newspapers?"
- "Can expats in Malmö follow local news in English?"

#### 2. Category Modules
Same structure as Stockholm:
- Politics (Gothenburg: "Gothenburg Politics", Malmö: "Malmö Politics")
- Business (Gothenburg: "Gothenburg Business & Port News", Malmö: "Malmö Business & Öresund")
- Tech (Gothenburg: "Gothenburg Tech & Innovation", Malmö: "Malmö Tech & Startups")
- Society (Gothenburg: "Gothenburg Society & Culture", Malmö: "Malmö Society & Culture")

#### 3. FAQ Visual Section
Add before closing `{/if}`:
```svelte
<!-- FAQ Section -->
<section class="mb-12 bg-gray-50 rounded-lg p-8">
  <h2 class="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
  <div class="space-y-6">
    <!-- 4 FAQ cards here -->
  </div>
</section>
```

#### 4. Enhanced Related Links
Change from gray-50 to blue-50 background for consistency

## Quick Implementation

Since Stockholm is complete, you can:
1. Copy `/stockholm/+page.svelte` structure
2. Find/replace "Stockholm" → "Gothenburg" or "Malmö"
3. Update city-specific keywords (Port of Gothenburg, Öresund region, etc.)
4. Adjust FAQ questions to be city-specific

## SEO Impact

Each city page will now:
- Target local search queries ("Gothenburg news in English", "Malmö news English")
- Capture featured snippets via FAQ schema
- Build topical authority through category clustering
- Create internal link equity flow
- Provide better UX with organized content

## File Sizes
- Stockholm: 413 lines (enhanced)
- Gothenburg: 212 lines → needs ~413 lines
- Malmö: 212 lines → needs ~413 lines

Total enhancement: +402 lines across 2 files
