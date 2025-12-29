import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') || '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

interface Subscription {
  endpoint: string;
  keys_p256dh: string;
  keys_auth: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    const { title, body, url, icon } = await req.json() as PushPayload;

    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'Missing title or body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('endpoint, keys_p256dh, keys_auth');

    if (error) {
      throw error;
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      icon: icon || '/android-chrome-192x192.png',
    });

    const results = await Promise.allSettled(
      (subscriptions as Subscription[]).map(async (sub) => {
        try {
          const response = await sendWebPush(sub, payload);
          if (response.status === 410 || response.status === 404) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint);
            return { status: 'removed', endpoint: sub.endpoint };
          }
          return { status: 'sent', endpoint: sub.endpoint };
        } catch (err) {
          return { status: 'failed', endpoint: sub.endpoint, error: String(err) };
        }
      })
    );

    const sent = results.filter((r) => r.status === 'fulfilled' && (r.value as { status: string }).status === 'sent').length;
    const removed = results.filter((r) => r.status === 'fulfilled' && (r.value as { status: string }).status === 'removed').length;
    const failed = results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && (r.value as { status: string }).status === 'failed')).length;

    return new Response(
      JSON.stringify({ sent, removed, failed, total: subscriptions.length }),
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

async function sendWebPush(subscription: Subscription, payload: string): Promise<Response> {
  const vapidHeaders = await generateVapidHeaders(subscription.endpoint);
  
  const body = await encryptPayload(
    payload,
    subscription.keys_p256dh,
    subscription.keys_auth
  );

  return fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
      ...vapidHeaders,
    },
    body,
  });
}

async function generateVapidHeaders(endpoint: string): Promise<Record<string, string>> {
  const audience = new URL(endpoint).origin;
  const expiration = Math.floor(Date.now() / 1000) + 12 * 60 * 60;

  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = {
    aud: audience,
    exp: expiration,
    sub: 'mailto:hello@nordicstoday.com',
  };

  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  
  const privateKeyBytes = base64UrlDecode(VAPID_PRIVATE_KEY);
  const key = await crypto.subtle.importKey(
    'raw',
    privateKeyBytes,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(unsignedToken)
  );

  const jwt = `${unsignedToken}.${base64UrlEncode(new Uint8Array(signature))}`;

  return {
    Authorization: `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`,
  };
}

async function encryptPayload(
  payload: string,
  p256dh: string,
  auth: string
): Promise<Uint8Array> {
  const clientPublicKey = base64UrlDecode(p256dh);
  const clientAuth = base64UrlDecode(auth);

  const localKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits']
  );

  const localPublicKey = await crypto.subtle.exportKey('raw', localKeyPair.publicKey);

  const clientKey = await crypto.subtle.importKey(
    'raw',
    clientPublicKey,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: clientKey },
    localKeyPair.privateKey,
    256
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));

  const ikm = await hkdf(
    new Uint8Array(sharedSecret),
    clientAuth,
    concatBuffers(
      new TextEncoder().encode('WebPush: info\0'),
      clientPublicKey,
      new Uint8Array(localPublicKey)
    ),
    32
  );

  const prk = await hkdf(ikm, salt, new TextEncoder().encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(ikm, salt, new TextEncoder().encode('Content-Encoding: nonce\0'), 12);

  const key = await crypto.subtle.importKey('raw', prk, 'AES-GCM', false, ['encrypt']);

  const paddedPayload = concatBuffers(
    new Uint8Array([0, 0]),
    new TextEncoder().encode(payload)
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    paddedPayload
  );

  const recordSize = new Uint8Array(4);
  new DataView(recordSize.buffer).setUint32(0, 4096, false);

  return concatBuffers(
    salt,
    recordSize,
    new Uint8Array([65]),
    new Uint8Array(localPublicKey),
    new Uint8Array(encrypted)
  );
}

async function hkdf(
  ikm: Uint8Array,
  salt: Uint8Array,
  info: Uint8Array,
  length: number
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', ikm, { name: 'HKDF' }, false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info },
    key,
    length * 8
  );
  return new Uint8Array(bits);
}

function concatBuffers(...buffers: Uint8Array[]): Uint8Array {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    result.set(buf, offset);
    offset += buf.length;
  }
  return result;
}

function base64UrlEncode(data: string | Uint8Array): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}
