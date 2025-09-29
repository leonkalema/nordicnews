import type { Handle, HandleServerError } from '@sveltejs/kit';

/**
 * SvelteKit server-side hooks for NordicNews
 * Handles redirects, security headers, and error logging
 */
export const handle: Handle = async ({ event, resolve }) => {
  const { url, request } = event;
  
  // Handle trailing slash redirects for SEO consistency
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    const redirectUrl = url.pathname.slice(0, -1) + url.search;
    return new Response(null, {
      status: 301,
      headers: {
        'Location': redirectUrl,
        'Cache-Control': 'max-age=31536000, public'
      }
    });
  }
  
  // Handle common redirects for old URLs
  const redirects: Record<string, string> = {
    '/news': '/',
    '/articles': '/',
    '/blog': '/',
    '/posts': '/',
    // Country redirects
    '/se': '/sweden',
    '/no': '/norway',
    '/dk': '/denmark',
    '/fi': '/finland',
    '/is': '/iceland'
  };
  
  if (redirects[url.pathname]) {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': redirects[url.pathname],
        'Cache-Control': 'max-age=31536000, public'
      }
    });
  }
  
  // Handle the request normally
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      // Add any HTML transformations here if needed
      return html;
    }
  });
  
  // Add security and SEO headers
  if (response.status === 200) {
    // Security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Cache headers for static content
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$/)) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    
    // Cache headers for news content (shorter cache for fresh news)
    if (url.pathname.startsWith('/article/')) {
      response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=7200');
    }
    
    // Cache headers for country pages
    if (url.pathname.match(/^\/(sweden|norway|denmark|finland|iceland)$/)) {
      response.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600');
    }
  }
  
  return response;
};

/**
 * Handle server-side errors
 */
export const handleError: HandleServerError = async ({ error, event }) => {
  const errorId = crypto.randomUUID();
  
  // Log error for monitoring
  console.error(`NordicNews Error ${errorId}:`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    url: event.url.pathname,
    userAgent: event.request.headers.get('user-agent'),
    timestamp: new Date().toISOString(),
    country: event.url.pathname.split('/')[1] // Extract country from URL
  });
  
  // Return user-friendly error message
  return {
    message: 'An unexpected error occurred while loading Nordic news. Please try again later.',
    errorId
  };
};
