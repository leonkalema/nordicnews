<script lang="ts">
	import type { FAQItem } from '$lib/config/countries';
	
	export let faqs: FAQItem[];
</script>

<section class="mb-12 bg-gray-50 rounded-lg p-8">
	<h2 class="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
	<div class="space-y-6">
		{#each faqs as faq}
			<div class="bg-white rounded-lg p-6 shadow-sm">
				<h3 class="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
				<p class="text-gray-700">{faq.answer}</p>
			</div>
		{/each}
	</div>
</section>
