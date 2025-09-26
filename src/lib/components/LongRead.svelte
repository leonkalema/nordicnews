<script lang="ts">
	// Dummy data
	const longReadArticle = {
		title: 'The Future of Nordic Energy: A Special Report',
		summary: 'An in-depth look at how the Nordic countries are pioneering the transition to sustainable energy, from geothermal power in Iceland to wind farms in the North Sea.',
		imageUrl: 'https://images.unsplash.com/photo-1629993248333-34b64e169dab?q=80&w=1932&auto=format&fit=crop',
		label: 'Special Report',
		slug: 'the-future-of-nordic-energy-a-special-report'
	};
</script>

<section class="bg-nordic-blue text-off-white py-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="relative rounded-lg overflow-hidden">
			<img src={longReadArticle.imageUrl} alt={longReadArticle.title} class="absolute inset-0 w-full h-full object-cover opacity-20" />
			<div class="relative text-center p-12">
				<span class="text-sm font-semibold uppercase tracking-wider text-arctic-gray">{longReadArticle.label}</span>
				<h2 class="mt-4 text-4xl font-bold">{longReadArticle.title}</h2>
				<p class="mt-4 max-w-2xl mx-auto text-lg text-arctic-gray">{longReadArticle.summary}</p>
				<a href="/article/{longReadArticle.slug}" class="mt-8 inline-block bg-off-white text-nordic-blue font-semibold px-8 py-3 rounded-lg hover:bg-arctic-gray transition-colors">
					Read More
				</a>
			</div>
		</div>
	</div>
</section>
