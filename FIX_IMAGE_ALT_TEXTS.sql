-- Fix all "AI-generated illustration" alt texts in published_articles table
-- This will set featured_image_alt to the article title (column has NOT NULL constraint)

-- First, check how many articles have this problem
SELECT COUNT(*) as articles_with_bad_alt
FROM published_articles
WHERE featured_image_alt LIKE '%AI-generated%';

-- Update all articles with "AI-generated" alt text to use the article title
UPDATE published_articles
SET featured_image_alt = title
WHERE featured_image_alt LIKE '%AI-generated%';

-- Verify the fix
SELECT COUNT(*) as articles_with_bad_alt_after_fix
FROM published_articles
WHERE featured_image_alt LIKE '%AI-generated%';

-- Also fix any empty or generic alt texts
UPDATE published_articles
SET featured_image_alt = title
WHERE featured_image_alt = '' 
   OR featured_image_alt IS NULL;
