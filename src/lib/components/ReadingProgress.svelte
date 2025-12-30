<script lang="ts">
	import { onMount } from 'svelte';

	let progress = $state(0);
	let visible = $state(false);

	onMount(() => {
		const article = document.querySelector('article');
		if (!article) return;

		const updateProgress = (): void => {
			const articleRect = article.getBoundingClientRect();
			const articleTop = window.scrollY + articleRect.top;
			const articleHeight = article.offsetHeight;
			const windowHeight = window.innerHeight;
			const scrollY = window.scrollY;

			const start = articleTop;
			const end = articleTop + articleHeight - windowHeight;
			const current = scrollY - start;
			const total = end - start;

			if (total <= 0) {
				progress = 100;
				visible = scrollY > 100;
				return;
			}

			progress = Math.min(100, Math.max(0, (current / total) * 100));
			visible = scrollY > 100;
		};

		window.addEventListener('scroll', updateProgress, { passive: true });
		updateProgress();

		return () => {
			window.removeEventListener('scroll', updateProgress);
		};
	});
</script>

{#if visible}
	<div
		class="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200"
		role="progressbar"
		aria-valuenow={Math.round(progress)}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-label="Reading progress"
	>
		<div
			class="h-full bg-nordic-blue transition-all duration-150 ease-out"
			style="width: {progress}%"
		></div>
	</div>
{/if}
