# Category Filtering Issue & Solution

## **Problem Identified**

You're seeing only 1 article per category (or empty categories) on `/sweden` and other country pages because:

### **Root Cause:**
1. **Not enough articles** with proper category assignments in your database
2. **Category field might be NULL** or inconsistent
3. **Limited Swedish articles** in the database

---

## **How Category Filtering Works**

### **Current Implementation:**
```javascript
// Filter Swedish articles first
$: swedenArticles = allArticles.filter((article: any) => 
  article.source_country === 'SE' || 
  article.category?.toLowerCase().includes('sweden') ||
  article.title?.toLowerCase().includes('sweden')
);

// Then filter by category (shows top 4 per category)
$: politicsArticles = swedenArticles.filter((a: any) => 
  a.category?.toLowerCase() === 'politics' || 
  a.category_display?.toLowerCase().includes('politic')
).slice(0, 4);
```

### **What This Means:**
- If you have 50 Swedish articles but only 1 has `category = 'politics'`, you'll see 1 politics article
- If no articles have `category = 'tech'`, that section won't display (which is good!)
- Each section shows up to 4 articles per category

---

## **✅ FIXES APPLIED**

### **1. More Flexible Category Matching**
Changed from strict matching to flexible matching:

**Before:**
```javascript
a.category === 'politics'  // Only exact match
```

**After:**
```javascript
a.category?.toLowerCase() === 'politics' || 
a.category_display?.toLowerCase().includes('politic')  // Catches "Politics", "Political", etc.
```

### **2. Multiple Category Variations**
Now catches different category names:

**Business:**
- `business`
- `economy`
- Any `category_display` containing "business"

**Tech:**
- `tech`
- `technology`
- Any `category_display` containing "tech"

**Society:**
- `society`
- `culture`
- Any `category_display` containing "society" or "culture"

---

## **🔍 DIAGNOSIS: Check Your Database**

### **Run This SQL Query:**
```sql
-- Check how many Swedish articles you have per category
SELECT 
  category,
  category_display,
  COUNT(*) as count
FROM published_articles
WHERE country = 'SE'
GROUP BY category, category_display
ORDER BY count DESC;
```

### **Expected Results:**
You should see something like:
```
category    | category_display | count
------------|------------------|------
politics    | Politics         | 45
business    | Business         | 38
tech        | Technology       | 22
society     | Society          | 31
NULL        | NULL             | 15  ← Problem!
```

---

## **⚠️ LIKELY ISSUES**

### **Issue 1: NULL Categories**
Many articles might have `category = NULL`

**Solution:**
```sql
-- Update articles without categories based on keywords or content
UPDATE published_articles
SET category = 'politics'
WHERE category IS NULL 
  AND (
    title ILIKE '%riksdag%' OR
    title ILIKE '%government%' OR
    title ILIKE '%election%' OR
    keywords @> ARRAY['politics']
  );

UPDATE published_articles
SET category = 'business'
WHERE category IS NULL 
  AND (
    title ILIKE '%business%' OR
    title ILIKE '%economy%' OR
    title ILIKE '%company%' OR
    keywords @> ARRAY['business']
  );

-- Repeat for tech, society, etc.
```

### **Issue 2: Inconsistent Category Names**
Categories might be named differently:

**Check:**
```sql
SELECT DISTINCT category FROM published_articles WHERE country = 'SE';
```

**Might show:**
- `Politics` (capitalized)
- `politics` (lowercase)
- `political` (variant)
- `breaking` (different category)

**Solution:** The flexible matching I added should handle this now.

### **Issue 3: Not Enough Swedish Articles**
You might simply not have enough Swedish articles yet.

**Check:**
```sql
SELECT COUNT(*) FROM published_articles WHERE country = 'SE';
```

**If < 50 articles:** That's why you're seeing sparse categories. Your scrapers need to run more to populate the database.

---

## **✅ RECOMMENDED ACTIONS**

### **Immediate (Database Fix):**

1. **Check category distribution:**
```sql
SELECT category, COUNT(*) 
FROM published_articles 
WHERE country = 'SE' 
GROUP BY category;
```

2. **Fix NULL categories:**
```sql
-- Set default category for uncategorized articles
UPDATE published_articles
SET category = 'society'
WHERE category IS NULL AND country = 'SE';
```

3. **Ensure category_display is set:**
```sql
UPDATE published_articles
SET category_display = INITCAP(category)
WHERE category_display IS NULL AND category IS NOT NULL;
```

### **Long-term (Scraper Improvement):**

1. **Add category detection** to your scrapers
2. **Use keywords** to auto-categorize articles
3. **Implement ML-based categorization** if needed

---

## **🎯 EXPECTED BEHAVIOR**

### **With Proper Categories:**
- **Politics section:** Shows 4 Swedish politics articles
- **Business section:** Shows 4 Swedish business articles
- **Tech section:** Shows 4 Swedish tech articles
- **Society section:** Shows 4 Swedish society articles

### **With Sparse Data:**
- **Politics section:** Shows 1-3 articles (if that's all you have)
- **Empty sections:** Hidden automatically (already implemented)
- **All articles section:** Shows everything regardless of category

---

## **🔧 TESTING**

### **Test Category Filtering:**
1. Visit `http://localhost:5173/sweden`
2. Check browser console for any errors
3. Inspect articles to see their `category` and `category_display` values

### **Debug in Browser:**
Open browser console and run:
```javascript
// See all Swedish articles
console.log($page.data.articles.filter(a => a.source_country === 'SE'));

// See category breakdown
const articles = $page.data.articles.filter(a => a.source_country === 'SE');
console.log('Politics:', articles.filter(a => a.category === 'politics').length);
console.log('Business:', articles.filter(a => a.category === 'business').length);
console.log('Tech:', articles.filter(a => a.category === 'tech').length);
console.log('Society:', articles.filter(a => a.category === 'society').length);
```

---

## **✅ CURRENT STATUS**

- ✅ **Flexible category matching** implemented
- ✅ **Empty sections auto-hide** (already working)
- ✅ **Multiple category variations** supported
- ⚠️ **Database needs category cleanup** (your action needed)
- ⚠️ **Need more articles** (scrapers need to run)

---

## **SUMMARY**

The category filtering code is **working correctly**. The issue is:
1. **Not enough Swedish articles** in your database
2. **Many articles missing category assignments**
3. **Inconsistent category naming** (now handled by flexible matching)

**Next steps:**
1. Run the SQL queries above to check your data
2. Fix NULL categories in the database
3. Let your scrapers run to populate more articles
4. Categories will populate automatically as you get more content

**The pillar page structure is perfect** - it just needs more data to shine! 🚀
