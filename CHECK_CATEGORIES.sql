-- Check Swedish articles by category
SELECT 
  CASE WHEN category IS NULL THEN 'NULL/Uncategorized' ELSE category END as category,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / 798, 1) as percentage
FROM published_articles
WHERE country = 'SE'
GROUP BY category
ORDER BY count DESC;

-- Also check what category values exist
SELECT DISTINCT category
FROM published_articles
WHERE country = 'SE' AND category IS NOT NULL
ORDER BY category;

-- Check a sample of articles to see their categories
SELECT 
  title,
  category,
  category_display,
  published_at
FROM published_articles
WHERE country = 'SE'
ORDER BY published_at DESC
LIMIT 20;
