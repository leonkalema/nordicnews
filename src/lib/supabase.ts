import { createClient } from '@supabase/supabase-js';

// Environment variables - you'll need to set these
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions based on your database schema
export interface PublishedArticle {
  id: string;
  raw_news_id: string | null;
  title: string;
  content: string;
  summary: string | null;
  country: 'SE' | 'NO' | 'DK' | 'FI' | 'IS';
  category: 'breaking' | 'business' | 'politics' | 'tech' | 'culture' | 'sports' | 'society';
  source_name: string;
  original_url: string;
  slug: string;
  published_at: string | null;
  view_count: number;
  meta_description: string | null;
  keywords: string[] | null;
  featured_image_url: string | null;
  featured_image_alt: string;
  featured_image_caption: string | null;
  image_credit: string | null;
  author_name?: string | null;
  author_slug?: string | null;
  author_id?: string | null;
}

// Country code to name mapping
export const COUNTRY_NAMES: Record<string, string> = {
  'SE': 'Sweden',
  'NO': 'Norway', 
  'DK': 'Denmark',
  'FI': 'Finland',
  'IS': 'Iceland'
};

// Category display names
export const CATEGORY_NAMES: Record<string, string> = {
  'breaking': 'Breaking News',
  'business': 'Business',
  'politics': 'Politics',
  'tech': 'Technology',
  'culture': 'Culture',
  'sports': 'Sports',
  'society': 'Society',
  'guide': 'Expert Guides',
  'editorial': 'Analysis & Opinion',
  'comparison': 'Comparisons'
};

// Helper function to format dates for Nordic audience
export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
}

// Helper function to format relative time (e.g., "2 hours ago")
export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return '';
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return formatDate(dateString);
  }
}

// Helper function to generate article excerpt
export function generateExcerpt(content: string, maxLength: number = 150): string {
  if (!content) return '';
  
  // Remove HTML tags if present
  const textContent = content.replace(/<[^>]*>/g, '');
  
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  // Find the last complete word within the limit
  const truncated = textContent.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

// Helper function to get country flag emoji
export function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    'SE': '🇸🇪',
    'NO': '🇳🇴',
    'DK': '🇩🇰',
    'FI': '🇫🇮',
    'IS': '🇮🇸'
  };
  return flags[countryCode] || '🏳️';
}

// Helper function to get category badge styling
export function getCategoryBadge(category: string): string {
  const badges: Record<string, string> = {
    'breaking': 'bg-red-100 text-red-800 border-red-200',
    'business': 'bg-blue-100 text-blue-800 border-blue-200',
    'politics': 'bg-purple-100 text-purple-800 border-purple-200',
    'tech': 'bg-green-100 text-green-800 border-green-200',
    'culture': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'sports': 'bg-orange-100 text-orange-800 border-orange-200',
    'society': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return badges[category] || 'bg-gray-100 text-gray-800 border-gray-200';
}

// Helper function to increment view count
export async function incrementViewCount(articleId: string): Promise<void> {
  try {
    await supabase.rpc('increment_view_count', { article_id: articleId });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    // Don't throw - view count is not critical
  }
}
