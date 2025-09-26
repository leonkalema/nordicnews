-- SQL functions to be executed in your Supabase database

-- Function to increment article view count
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE published_articles 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trending articles (most viewed in last 24 hours)
CREATE OR REPLACE FUNCTION get_trending_articles(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  summary TEXT,
  country VARCHAR(2),
  category VARCHAR(50),
  source_name VARCHAR(50),
  slug VARCHAR(200),
  published_at TIMESTAMPTZ,
  view_count INTEGER,
  featured_image_url VARCHAR(1000),
  featured_image_alt TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pa.id,
    pa.title,
    pa.summary,
    pa.country,
    pa.category,
    pa.source_name,
    pa.slug,
    pa.published_at,
    pa.view_count,
    pa.featured_image_url,
    pa.featured_image_alt
  FROM published_articles pa
  WHERE pa.published_at >= NOW() - INTERVAL '24 hours'
  ORDER BY pa.view_count DESC, pa.published_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get article statistics
CREATE OR REPLACE FUNCTION get_article_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_articles', (SELECT COUNT(*) FROM published_articles),
    'articles_today', (SELECT COUNT(*) FROM published_articles WHERE published_at >= CURRENT_DATE),
    'articles_this_week', (SELECT COUNT(*) FROM published_articles WHERE published_at >= CURRENT_DATE - INTERVAL '7 days'),
    'by_country', (
      SELECT json_object_agg(country, article_count)
      FROM (
        SELECT country, COUNT(*) as article_count
        FROM published_articles
        GROUP BY country
      ) country_stats
    ),
    'by_category', (
      SELECT json_object_agg(category, article_count)
      FROM (
        SELECT category, COUNT(*) as article_count
        FROM published_articles
        GROUP BY category
      ) category_stats
    ),
    'top_sources', (
      SELECT json_agg(json_build_object('source', source_name, 'count', article_count))
      FROM (
        SELECT source_name, COUNT(*) as article_count
        FROM published_articles
        GROUP BY source_name
        ORDER BY article_count DESC
        LIMIT 10
      ) source_stats
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for full-text search with ranking
CREATE OR REPLACE FUNCTION search_articles(
  search_term TEXT,
  country_filter VARCHAR(2) DEFAULT NULL,
  category_filter VARCHAR(50) DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  summary TEXT,
  country VARCHAR(2),
  category VARCHAR(50),
  source_name VARCHAR(50),
  slug VARCHAR(200),
  published_at TIMESTAMPTZ,
  view_count INTEGER,
  featured_image_url VARCHAR(1000),
  featured_image_alt TEXT,
  search_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pa.id,
    pa.title,
    pa.summary,
    pa.country,
    pa.category,
    pa.source_name,
    pa.slug,
    pa.published_at,
    pa.view_count,
    pa.featured_image_url,
    pa.featured_image_alt,
    ts_rank(
      to_tsvector('english', pa.title || ' ' || COALESCE(pa.summary, '') || ' ' || pa.content),
      plainto_tsquery('english', search_term)
    ) as search_rank
  FROM published_articles pa
  WHERE 
    to_tsvector('english', pa.title || ' ' || COALESCE(pa.summary, '') || ' ' || pa.content) 
    @@ plainto_tsquery('english', search_term)
    AND (country_filter IS NULL OR pa.country = country_filter)
    AND (category_filter IS NULL OR pa.category = category_filter)
  ORDER BY search_rank DESC, pa.published_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_published_articles_search_vector 
ON published_articles USING gin(to_tsvector('english', title || ' ' || COALESCE(summary, '') || ' ' || content));

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_trending_articles(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_article_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION search_articles(TEXT, VARCHAR(2), VARCHAR(50), INTEGER, INTEGER) TO authenticated;

-- Grant execute permissions to anonymous users (for public access)
GRANT EXECUTE ON FUNCTION get_trending_articles(INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_article_stats() TO anon;
GRANT EXECUTE ON FUNCTION search_articles(TEXT, VARCHAR(2), VARCHAR(50), INTEGER, INTEGER) TO anon;
