import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email } = await request.json();

		if (!email) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		const { error } = await supabase
			.from('newsletter_subscribers')
			.update({
				status: 'unsubscribed',
				unsubscribed_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.eq('email', email.toLowerCase());

		if (error) {
			console.error('Newsletter unsubscribe error:', error);
			return json({ error: 'Failed to unsubscribe' }, { status: 500 });
		}

		return json({ success: true, message: 'Successfully unsubscribed.' });
	} catch (err) {
		console.error('Newsletter unsubscribe error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
