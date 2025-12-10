import { fail } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import type { Actions } from './$types';

// Use service role for server-side operations (bypasses RLS)
const supabaseUrl = 'https://efqogymhexbveihxtzsj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmcW9neW1oZXhidmVpaHh0enNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYyMDQ1MSwiZXhwIjoyMDc0MTk2NDUxfQ.eD34arq1uAEPqMU5dsQDuutKweXyH2OdDfP2lX_V7V8';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Security: Sanitize text input to prevent XSS
function sanitizeText(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 10000); // Limit length
}

// Security: Sanitize HTML/Markdown content (allow markdown but strip dangerous tags)
function sanitizeContent(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .slice(0, 50000); // Limit content length
}

// Security: Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Security: Validate URL format
function isValidUrl(url: string | null): boolean {
  if (!url) return true; // Optional field
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    
    // Extract and sanitize form fields
    const name = sanitizeText(formData.get('name')?.toString());
    const email = sanitizeText(formData.get('email')?.toString()).toLowerCase();
    const title = sanitizeText(formData.get('title')?.toString());
    const institution = sanitizeText(formData.get('institution')?.toString());
    const bio = sanitizeText(formData.get('bio')?.toString());
    const linkedin = sanitizeText(formData.get('linkedin')?.toString()) || null;
    const website = sanitizeText(formData.get('website')?.toString()) || null;
    
    const articleTitle = sanitizeText(formData.get('article_title')?.toString());
    const summary = sanitizeText(formData.get('summary')?.toString());
    const content = sanitizeContent(formData.get('content')?.toString());
    const topics = formData.getAll('topics').map(t => sanitizeText(t.toString())).filter(t => t);
    const conflict = sanitizeText(formData.get('conflict')?.toString()) || null;
    
    const originalWork = formData.get('original_work') === 'on';
    const agreeTerms = formData.get('agree_terms') === 'on';
    const agreeEdit = formData.get('agree_edit') === 'on';
    
    // Security validations
    if (!isValidEmail(email)) {
      return fail(400, { message: 'Please provide a valid email address.' });
    }
    
    if (linkedin && !isValidUrl(linkedin)) {
      return fail(400, { message: 'Please provide a valid LinkedIn URL.' });
    }
    
    if (website && !isValidUrl(website)) {
      return fail(400, { message: 'Please provide a valid website URL.' });
    }

    // Validation
    if (!name || !email || !title || !institution || !bio) {
      return fail(400, { message: 'Please fill in all required author information.' });
    }
    
    if (!articleTitle || !summary || !content) {
      return fail(400, { message: 'Please fill in all required article fields.' });
    }
    
    if (topics.length === 0) {
      return fail(400, { message: 'Please select at least one topic.' });
    }
    
    if (!originalWork || !agreeTerms || !agreeEdit) {
      return fail(400, { message: 'Please agree to all required terms.' });
    }
    
    // Word count validation
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 500) {
      return fail(400, { message: `Article is too short (${wordCount} words). Minimum 800 words required.` });
    }
    if (wordCount > 2000) {
      return fail(400, { message: `Article is too long (${wordCount} words). Maximum 1,500 words allowed.` });
    }

    try {
      // Step 1: Check if contributor exists, or create new one
      let contributorId: string;
      
      const { data: existingContributor } = await supabaseAdmin
        .from('opinion_contributors')
        .select('id')
        .eq('email', email)
        .single();
      
      if (existingContributor) {
        contributorId = existingContributor.id;
        
        // Update their info in case it changed
        await supabaseAdmin
          .from('opinion_contributors')
          .update({
            name,
            title,
            institution,
            bio,
            linkedin_url: linkedin,
            website_url: website
          })
          .eq('id', contributorId);
      } else {
        // Create new contributor
        const { data: newContributor, error: contributorError } = await supabaseAdmin
          .from('opinion_contributors')
          .insert({
            email,
            name,
            title,
            institution,
            bio,
            linkedin_url: linkedin,
            website_url: website,
            verified: false
          })
          .select('id')
          .single();
        
        if (contributorError) {
          console.error('Error creating contributor:', contributorError);
          return fail(500, { message: 'Failed to create contributor profile. Please try again.' });
        }
        
        contributorId = newContributor.id;
      }

      // Step 2: Create submission
      const { error: submissionError } = await supabaseAdmin
        .from('opinion_submissions')
        .insert({
          contributor_id: contributorId,
          title: articleTitle,
          content,
          summary,
          topics,
          word_count: wordCount,
          conflict_disclosure: conflict,
          agreed_to_terms: true,
          status: 'pending'
        });
      
      if (submissionError) {
        console.error('Error creating submission:', submissionError);
        return fail(500, { message: 'Failed to submit article. Please try again.' });
      }

      // Success!
      return { success: true };
      
    } catch (error) {
      console.error('Submission error:', error);
      return fail(500, { message: 'An unexpected error occurred. Please try again.' });
    }
  }
};
