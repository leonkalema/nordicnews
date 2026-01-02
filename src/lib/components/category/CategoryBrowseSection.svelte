<script lang="ts">
	type CategoryBrowseSectionProps = {
		readonly isOpinion: boolean;
	};

	const { isOpinion }: CategoryBrowseSectionProps = $props();
</script>

<section class="mt-16 pt-8 border-t border-gray-200">
	<h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Browse Categories</h3>
	<div class="flex flex-wrap gap-3">
		<a href="/category/breaking" class="border border-gray-200 hover:border-black hover:bg-black hover:text-white px-4 py-2 text-sm text-gray-600 transition-all">Breaking</a>
		<a href="/category/politics" class="border border-gray-200 hover:border-black hover:bg-black hover:text-white px-4 py-2 text-sm text-gray-600 transition-all">Politics</a>
		<a href="/category/business" class="border border-gray-200 hover:border-black hover:bg-black hover:text-white px-4 py-2 text-sm text-gray-600 transition-all">Business</a>
		<a href="/category/tech" class="border border-gray-200 hover:border-black hover:bg-black hover:text-white px-4 py-2 text-sm text-gray-600 transition-all">Technology</a>
		<a href="/category/culture" class="border border-gray-200 hover:border-black hover:bg-black hover:text-white px-4 py-2 text-sm text-gray-600 transition-all">Culture</a>
		<a href="/category/society" class="border border-gray-200 hover:border-black hover:bg-black hover:text-white px-4 py-2 text-sm text-gray-600 transition-all">Society</a>
		<a href="/category/sports" class="border border-gray-200 hover:border-black hover:bg-black hover:text-white px-4 py-2 text-sm text-gray-600 transition-all">Sports</a>
		<a href="/category/opinion" class="border border-gray-200 hover:border-black hover:bg-black hover:text-white px-4 py-2 text-sm text-gray-600 transition-all">Opinion</a>
	</div>
</section>

{#if isOpinion}
	<section class="mt-16 pt-8 border-t border-gray-200">
		<h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">FAQ</h2>
		<div class="space-y-4">
			<details class="bg-white border border-gray-200 rounded-lg">
				<summary class="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">What is the Opinion section on Nordics Today?</summary>
				<p class="px-4 pb-4 text-gray-600">The Opinion section features expert perspectives, analysis, and commentary from academics, researchers, industry leaders, and qualified contributors on topics affecting the Nordic region. These are not news articles but informed viewpoints.</p>
			</details>
			<details class="bg-white border border-gray-200 rounded-lg">
				<summary class="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Do opinion pieces reflect the editorial position of Nordics Today?</summary>
				<p class="px-4 pb-4 text-gray-600">No. Opinion pieces represent the personal views of their authors only. They do not necessarily reflect the editorial position or views of Nordics Today or its staff.</p>
			</details>
			<details class="bg-white border border-gray-200 rounded-lg">
				<summary class="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">How can I submit an opinion piece to Nordics Today?</summary>
				<p class="px-4 pb-4 text-gray-600">We welcome submissions from academics, researchers, and industry experts. Please use our <a href="/contribute" class="text-blue-600 hover:underline">submission form</a> to submit your article with your credentials and bio. All submissions undergo editorial review.</p>
			</details>
			<details class="bg-white border border-gray-200 rounded-lg">
				<summary class="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Who can contribute opinion pieces?</summary>
				<p class="px-4 pb-4 text-gray-600">We accept submissions from qualified contributors including university professors, researchers, policy experts, industry executives, and other professionals with demonstrated expertise in Nordic affairs, business, politics, or society.</p>
			</details>
		</div>
	</section>
{/if}
