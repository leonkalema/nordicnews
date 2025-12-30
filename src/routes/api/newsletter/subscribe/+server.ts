import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, name, source } = await request.json();

		if (!email || !isValidEmail(email)) {
			return json({ error: 'Valid email is required' }, { status: 400 });
		}

		const { data: existingRows } = await supabase
			.from('newsletter_subscribers')
			.select('id, status')
			.eq('email', email.toLowerCase())
			.limit(1);

		const existing = existingRows?.[0];

		if (existing) {
			if (existing.status === 'unsubscribed') {
				await supabase
					.from('newsletter_subscribers')
					.update({ status: 'active', updated_at: new Date().toISOString() })
					.eq('id', existing.id);
				return json({ success: true, message: 'Welcome back! You have been resubscribed.' });
			}
			return json({ success: true, message: 'You are already subscribed.' });
		}

		const { error } = await supabase
			.from('newsletter_subscribers')
			.insert({
				email: email.toLowerCase(),
				name: name || null,
				source: source || 'website',
				status: 'active'
			});

		if (error) {
			console.error('Newsletter subscribe error:', error);
			return json({ error: 'Failed to subscribe' }, { status: 500 });
		}

		return json({ success: true, message: 'Successfully subscribed!' });
	} catch (err) {
		console.error('Newsletter subscribe error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};
