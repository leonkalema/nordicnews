import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface Article {
  id: string;
  title: string;
  summary: string | null;
  slug: string;
  country: string;
  category: string;
  view_count: number;
  published_at: string;
  featured_image_url: string | null;
}

interface Subscriber {
  email: string;
}

const COUNTRY_NAMES: Record<string, string> = {
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  IS: 'Iceland',
};

const WRITING_PROMPT = `You write newsletter emails for Nordics Today, a news site covering Sweden, Norway, Denmark, Finland, and Iceland.

RULES:
- Write sentences averaging 10-20 words, focusing on one idea each
- Use active voice 90% of the time
- Use everyday vocabulary, no jargon
- Mix short and medium sentences
- Provide concrete details: numbers, dates, names
- NO semicolons, NO em dashes
- NEVER use: however, moreover, furthermore, additionally, consequently, therefore, ultimately, leverage, utilize, innovative, dynamic, cutting-edge, game-changer, delve, embark, tapestry, landscape, realm, seamless, robust, holistic, paradigm, synergy
- NO hedging words: might, could, would, may
- NO apologies or AI references
- Be direct and engaging
- Create curiosity without clickbait

Your tone: Smart friend sharing interesting news over coffee. Warm but not cheesy.`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateEmailContent = async (articles: Article[]): Promise<{ subject: string; html: string; text: string }> => {
  const articleSummaries = articles.map((a, i) => 
    `${i + 1}. "${a.title}" (${COUNTRY_NAMES[a.country]}, ${a.category}) - ${a.summary || 'No summary'} - ${a.view_count} views`
  ).join('\n');

  const today = new Date();
  const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dateRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const storyCount = articles.length;
  const prompt = `${WRITING_PROMPT}

Write a weekly newsletter email for the week of ${dateRange}.

TOP ${storyCount} STORIES THIS WEEK (from different Nordic countries):
${articleSummaries}

Generate:
1. SUBJECT LINE: Make it irresistible. 5-8 words max. Create curiosity. No clickbait. Pick the most interesting angle from any story. Examples: "Finland just banned something unexpected", "Why Swedes are leaving Stockholm", "Denmark's bold move shocks Europe"

2. EMAIL BODY: 
- Opening line that hooks (1-2 sentences, no greeting). Mention it's a roundup from across the Nordics.
- Brief engaging summary of EACH story (2-3 sentences each). Make readers want to click.
- End with a simple sign-off like "See you next week" or "Until next Sunday"

Format your response as JSON with exactly ${storyCount} stories:
{
  "subject": "your subject line",
  "intro": "your opening hook",
  "stories": [
    {"headline": "rewritten headline for story 1", "teaser": "2-3 sentence teaser"},
    {"headline": "rewritten headline for story 2", "teaser": "2-3 sentence teaser"}
    // ... one entry per story
  ],
  "signoff": "brief sign-off"
}`;

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  let parsed;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch {
    throw new Error('Failed to parse AI response');
  }

  const html = buildEmailHtml(parsed, articles, dateRange);
  const text = buildEmailText(parsed, articles);

  return { subject: parsed.subject, html, text };
};

const buildEmailHtml = (
  content: { intro: string; stories: { headline: string; teaser: string }[]; signoff: string },
  articles: Article[],
  dateRange: string
): string => {
  const storiesHtml = content.stories.map((story, i) => {
    const article = articles[i];
    if (!article) return '';
    const imageHtml = article.featured_image_url 
      ? `<img src="${article.featured_image_url}" alt="${article.title}" style="width:100%;max-width:520px;height:auto;border-radius:4px;margin-bottom:12px;border:1px solid #e5e7eb;">`
      : '';
    
    return `
      <tr>
        <td style="padding:20px 0;border-bottom:1px solid #e5e7eb;">
          ${imageHtml}
          <p style="margin:0 0 6px;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-weight:500;">
            ${COUNTRY_NAMES[article.country]} · ${article.category}
          </p>
          <h2 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#111827;font-family:Georgia,'Times New Roman',serif;">
            <a href="https://nordicstoday.com/article/${article.slug}" style="color:#111827;text-decoration:none;">
              ${story.headline}
            </a>
          </h2>
          <p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:#4b5563;">
            ${story.teaser}
          </p>
          <a href="https://nordicstoday.com/article/${article.slug}" style="display:inline-block;font-size:13px;font-weight:500;color:#374151;text-decoration:none;">
            Read more →
          </a>
        </td>
      </tr>
    `;
  }).join('');

  // Quick links section
  const quickLinksHtml = `
    <tr>
      <td style="padding:20px 0;">
        <p style="margin:0 0 12px;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-weight:500;">
          Browse by Country
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:4px 0;">
              <a href="https://nordicstoday.com/sweden" style="font-size:14px;color:#374151;text-decoration:none;">🇸🇪 Sweden</a>
            </td>
            <td style="padding:4px 0;">
              <a href="https://nordicstoday.com/norway" style="font-size:14px;color:#374151;text-decoration:none;">🇳🇴 Norway</a>
            </td>
            <td style="padding:4px 0;">
              <a href="https://nordicstoday.com/denmark" style="font-size:14px;color:#374151;text-decoration:none;">🇩🇰 Denmark</a>
            </td>
          </tr>
          <tr>
            <td style="padding:4px 0;">
              <a href="https://nordicstoday.com/finland" style="font-size:14px;color:#374151;text-decoration:none;">🇫🇮 Finland</a>
            </td>
            <td style="padding:4px 0;">
              <a href="https://nordicstoday.com/iceland" style="font-size:14px;color:#374151;text-decoration:none;">🇮🇸 Iceland</a>
            </td>
            <td style="padding:4px 0;">
              <a href="https://nordicstoday.com/category/guide" style="font-size:14px;color:#374151;text-decoration:none;">📚 Guides</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nordic News Weekly</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f8f8;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border:1px solid #e5e7eb;">
          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid #e5e7eb;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <img src="https://nordicstoday.com/logo.png" alt="Nordics Today" style="height:40px;width:auto;">
                  </td>
                  <td align="right" style="font-size:12px;color:#9ca3af;">
                    ${dateRange}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Intro -->
          <tr>
            <td style="padding:24px 32px 16px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">
                ${content.intro}
              </p>
            </td>
          </tr>
          
          <!-- Stories -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${storiesHtml}
              </table>
            </td>
          </tr>
          
          <!-- Quick Links -->
          <tr>
            <td style="padding:16px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${quickLinksHtml}
              </table>
            </td>
          </tr>
          
          <!-- Sign-off -->
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">
                ${content.signoff}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;font-size:11px;color:#9ca3af;">
                You subscribed to Nordic News Weekly at nordicstoday.com
              </p>
              <a href="{{unsubscribe_url}}" style="font-size:11px;color:#6b7280;text-decoration:underline;">
                Unsubscribe
              </a>
              <p style="margin:12px 0 0;font-size:11px;color:#d1d5db;">
                © ${new Date().getFullYear()} Nordics Today
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const buildEmailText = (
  content: { intro: string; stories: { headline: string; teaser: string }[]; signoff: string },
  articles: Article[]
): string => {
  const storiesText = content.stories.map((story, i) => {
    const article = articles[i];
    return `
${COUNTRY_NAMES[article.country]} · ${article.category}
${story.headline}

${story.teaser}

Read more: https://nordicstoday.com/article/${article.slug}
`;
  }).join('\n---\n');

  return `
NORDICS TODAY - WEEKLY DIGEST

${content.intro}

---
${storiesText}
---

${content.signoff}

— The Nordics Today Team

---
Unsubscribe: {{unsubscribe_url}}
  `.trim();
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.includes(SUPABASE_SERVICE_ROLE_KEY)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Fetch top articles from different countries to ensure diversity
    const { data: allArticles, error: articlesError } = await supabase
      .from('published_articles')
      .select('id, title, summary, slug, country, category, view_count, published_at, featured_image_url')
      .gte('published_at', oneWeekAgo.toISOString())
      .eq('is_active', true)
      .order('view_count', { ascending: false })
      .limit(20);

    // Select diverse articles: one per country, max 5
    const seenCountries = new Set<string>();
    const seenTitles = new Set<string>();
    const articles = (allArticles || []).filter((a: Article) => {
      // Skip if we already have an article from this country
      if (seenCountries.has(a.country)) return false;
      // Skip similar titles (first 30 chars match)
      const titlePrefix = a.title.substring(0, 30).toLowerCase();
      if (seenTitles.has(titlePrefix)) return false;
      seenCountries.add(a.country);
      seenTitles.add(titlePrefix);
      return true;
    }).slice(0, 5);

    if (articlesError) {
      throw articlesError;
    }

    if (!articles || articles.length === 0) {
      return new Response(JSON.stringify({ error: 'No articles found for this week' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { subject, html, text } = await generateEmailContent(articles as Article[]);

    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('status', 'active');

    if (subscribersError) {
      throw subscribersError;
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ error: 'No active subscribers' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emails = (subscribers as Subscriber[]).map(s => s.email);
    const batchSize = 50;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);

      try {
        const response = await fetch('https://api.resend.com/emails/batch', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            batch.map((email: string) => ({
              from: 'Nordics Today <newsletter@nordicstoday.com>',
              to: email,
              subject,
              html: html.replace('{{unsubscribe_url}}', `https://nordicstoday.com/unsubscribe?email=${encodeURIComponent(email)}`),
              text: text.replace('{{unsubscribe_url}}', `https://nordicstoday.com/unsubscribe?email=${encodeURIComponent(email)}`),
            }))
          ),
        });

        if (response.ok) {
          sent += batch.length;
        } else {
          const errorData = await response.json();
          console.error('Resend batch error:', errorData);
          failed += batch.length;
        }
      } catch (err) {
        console.error('Batch send error:', err);
        failed += batch.length;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        subject,
        articlesUsed: articles.map((a: Article) => a.title),
        sent,
        failed,
        total: emails.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
