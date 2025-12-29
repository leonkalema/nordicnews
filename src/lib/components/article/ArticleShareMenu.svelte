<script lang="ts">
	import { onMount } from 'svelte';
	import { Share, Facebook, Twitter, Linkedin } from 'lucide-svelte';

	type ArticleShareMenuProps = {
		readonly title: string;
	};

	const { title }: ArticleShareMenuProps = $props();
	let showShareMenu = $state(false);
	let rootEl: HTMLDivElement | null = $state(null);

	const shareOnFacebook = (): void => {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
	};

	const shareOnTwitter = (): void => {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(title);
		window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
	};

	const shareOnLinkedIn = (): void => {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
	};

	const copyToClipboard = async (): Promise<void> => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			alert('Link copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	};

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!showShareMenu) return;
			const target = event.target as Node | null;
			if (rootEl && target && !rootEl.contains(target)) {
				showShareMenu = false;
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="relative share-menu" bind:this={rootEl}>
	<button
		onclick={() => {
			showShareMenu = !showShareMenu;
		}}
		class="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
		type="button"
	>
		<Share size={14} />
		Share
	</button>
	{#if showShareMenu}
		<div class="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-48">
			<button onclick={shareOnFacebook} class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3" type="button">
				<Facebook size={18} class="text-blue-600" />
				Facebook
			</button>
			<button onclick={shareOnTwitter} class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3" type="button">
				<Twitter size={18} class="text-blue-400" />
				Twitter
			</button>
			<button onclick={shareOnLinkedIn} class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3" type="button">
				<Linkedin size={18} class="text-blue-700" />
				LinkedIn
			</button>
			<button onclick={copyToClipboard} class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3" type="button">
				<Share size={18} class="text-gray-600" />
				Copy Link
			</button>
		</div>
	{/if}
</div>
