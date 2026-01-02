<script lang="ts">
	type CityHub = {
		readonly name: string;
		readonly slug: string;
		readonly description: string;
	};

	type CountryCityHubsSectionProps = {
		readonly country: string;
		readonly cities: readonly CityHub[];
	};

	const { country, cities }: CountryCityHubsSectionProps = $props();
</script>

<section class="mb-16">
	<div class="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
		<div class="mb-10">
			<h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">By City</h2>
			<p class="font-serif text-3xl font-semibold text-gray-900">News from {country}'s Cities</p>
		</div>
		<div class="grid gap-6 md:grid-cols-{cities.length}">
			{#each cities as city}
				<a href="/{city.slug}" class="group bg-white p-6 border border-gray-200 hover:border-black transition-all">
					<h3 class="font-serif text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">{city.name}</h3>
					<p class="text-gray-500 text-sm leading-relaxed">{city.description}</p>
				</a>
			{/each}
		</div>
	</div>
</section>
