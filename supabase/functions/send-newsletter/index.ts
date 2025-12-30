import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface NewsletterPayload {
  subject: string;
  html: string;
  text?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { subject, html, text } = await req.json() as NewsletterPayload;

    if (!subject || !html) {
      return new Response(JSON.stringify({ error: 'Missing subject or html' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('status', 'active');

    if (error) {
      throw error;
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ error: 'No active subscribers' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emails = subscribers.map((s: { email: string }) => s.email);

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
              text: text?.replace('{{unsubscribe_url}}', `https://nordicstoday.com/unsubscribe?email=${encodeURIComponent(email)}`),
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
      JSON.stringify({ sent, failed, total: emails.length }),
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
