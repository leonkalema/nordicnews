import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const subscription = await request.json();

		if (!subscription?.endpoint) {
			return json({ error: 'Invalid subscription' }, { status: 400 });
		}

		const { error } = await supabase
			.from('push_subscriptions')
			.upsert(
				{
					endpoint: subscription.endpoint,
					keys_p256dh: subscription.keys?.p256dh,
					keys_auth: subscription.keys?.auth,
					user_agent: request.headers.get('user-agent') || '',
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				},
				{ onConflict: 'endpoint' }
			);

		if (error) {
			console.error('Failed to save subscription:', error);
			return json({ error: 'Failed to save subscription' }, { status: 500 });
		}

		return json({ success: true });
	} catch (err) {
		console.error('Push subscribe error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { endpoint } = await request.json();

		if (!endpoint) {
			return json({ error: 'Missing endpoint' }, { status: 400 });
		}

		const { error } = await supabase
			.from('push_subscriptions')
			.delete()
			.eq('endpoint', endpoint);

		if (error) {
			console.error('Failed to delete subscription:', error);
			return json({ error: 'Failed to delete subscription' }, { status: 500 });
		}

		return json({ success: true });
	} catch (err) {
		console.error('Push unsubscribe error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
