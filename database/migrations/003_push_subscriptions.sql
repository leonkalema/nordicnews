-- Push subscriptions table for PWA notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT UNIQUE NOT NULL,
    keys_p256dh TEXT NOT NULL,
    keys_auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_created_at ON push_subscriptions(created_at DESC);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for subscribing)
CREATE POLICY "Allow anonymous insert" ON push_subscriptions
    FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous delete (for unsubscribing)
CREATE POLICY "Allow anonymous delete" ON push_subscriptions
    FOR DELETE TO anon USING (true);

-- Only service role can select (for sending notifications)
CREATE POLICY "Service role can select" ON push_subscriptions
    FOR SELECT TO service_role USING (true);
