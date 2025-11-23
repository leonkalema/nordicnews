import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  // Fetch author by slug
  const { data: authors, error: authorErr } = await supabase
    .from('authors')
    .select('id, name, slug, bio, specialties, country_focus, topic_focus, profile_image_url, email, active')
    .eq('slug', slug)
    .eq('active', true)
    .limit(1);

  if (authorErr) {
    console.error('Author fetch error:', authorErr);
    throw error(500, 'Unable to load author');
  }

  const author = authors && authors[0];
  if (!author) {
    throw error(404, 'Author not found');
  }

  // Fetch author's articles
  const { data: articles, error: articlesErr } = await supabase
    .from('published_articles')
    .select(`
      id,
      title,
      summary,
      country,
      category,
      slug,
      published_at,
      view_count,
      featured_image_url,
      featured_image_alt
    `)
    .eq('author_slug', slug)
    .order('published_at', { ascending: false })
    .limit(24);

  if (articlesErr) {
    console.error('Author articles fetch error:', articlesErr);
    throw error(500, 'Unable to load author articles');
  }

  return { author, articles: articles || [] };
};
