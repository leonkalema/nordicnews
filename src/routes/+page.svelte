<script lang="ts">
	import DailySnapshot from '$lib/components/DailySnapshot.svelte';
	import AcrossTheNordics from '$lib/components/AcrossTheNordics.svelte';
	import DeepDive from '$lib/components/DeepDive.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Nordics Today - Your Daily Source for Nordic News</title>
	<meta name="description" content="The latest news and analysis from Sweden, Norway, Denmark, Finland, and Iceland, translated for a global audience." />
</svelte:head>

<DailySnapshot featuredArticles={data.featuredArticles || []} />
<AcrossTheNordics articlesByCountry={data.articlesByCountry || []} />
<DeepDive 
	latestArticles={data.latestArticles || []} 
	articlesByCategory={data.articlesByCategory || []} 
	trendingArticles={data.trendingArticles || []} 
/>
