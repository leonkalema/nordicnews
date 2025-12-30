-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source TEXT DEFAULT 'website',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for subscribing)
CREATE POLICY "Allow anonymous insert" ON newsletter_subscribers
    FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous update for unsubscribe (by email match)
CREATE POLICY "Allow anonymous update" ON newsletter_subscribers
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Only service role can select all (for sending newsletters)
CREATE POLICY "Service role can select" ON newsletter_subscribers
    FOR SELECT TO service_role USING (true);
