<script lang="ts">
	import { Search, Menu } from 'svelte-lucide-icons';

	let isMenuOpen = false;
	let searchQuery = '';

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleSearch() {
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
		}
	}

	const categories = [
		{ name: 'Guides', slug: 'guide' },
		{ name: 'Politics', slug: 'politics' },
		{ name: 'Business', slug: 'business' },
		{ name: 'Tech', slug: 'tech' },
		{ name: 'Society', slug: 'society' },
		{ name: 'Opinion', slug: 'opinion' }
	];
</script>

<header class="bg-white shadow-sm border-b border-gray-200">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Top Row: Logo + Countries + Search -->
		<div class="flex justify-between items-center py-3">
			<!-- Logo -->
			<div class="flex-shrink-0">
				<a href="/" class="flex items-center">
					<img src="/logo.png" alt="Nordics Today" class="h-16 w-auto" />
				</a>
			</div>

			<!-- Desktop Navigation - Countries -->
			<nav class="hidden md:flex space-x-8 flex-1 justify-center">
				<a href="/" class="text-sm font-medium text-gray-900 hover:text-nordic-blue transition-colors uppercase tracking-wide">HOME</a>
				<a href="/sweden" data-sveltekit-reload class="text-sm font-medium text-gray-900 hover:text-nordic-blue transition-colors uppercase tracking-wide">SWEDEN</a>
				<a href="/norway" data-sveltekit-reload class="text-sm font-medium text-gray-900 hover:text-nordic-blue transition-colors uppercase tracking-wide">NORWAY</a>
				<a href="/denmark" data-sveltekit-reload class="text-sm font-medium text-gray-900 hover:text-nordic-blue transition-colors uppercase tracking-wide">DENMARK</a>
				<a href="/finland" data-sveltekit-reload class="text-sm font-medium text-gray-900 hover:text-nordic-blue transition-colors uppercase tracking-wide">FINLAND</a>
				<a href="/iceland" data-sveltekit-reload class="text-sm font-medium text-gray-900 hover:text-nordic-blue transition-colors uppercase tracking-wide">ICELAND</a>
			</nav>

			<!-- Search -->
			<div class="hidden md:flex">
				<div class="relative">
					<input 
						type="text" 
						placeholder="Search" 
						bind:value={searchQuery}
						on:keydown={(e) => e.key === 'Enter' && handleSearch()}
						class="w-48 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-nordic-blue focus:border-nordic-blue"
					/>
					<button 
						on:click={handleSearch}
						class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-nordic-blue"
					>
						<Search size={16} />
					</button>
				</div>
			</div>

			<!-- Mobile Menu Button -->
			<div class="md:hidden">
				<button on:click={toggleMenu} class="text-gray-700 hover:text-nordic-blue focus:outline-none">
					<Menu size={24} />
				</button>
			</div>
		</div>

		<!-- Bottom Row: Categories (Desktop only) -->
		<div class="hidden md:flex justify-end items-center py-2 border-t border-gray-100">
			<nav class="flex items-center space-x-6 text-xs text-gray-600">
				{#each categories as category}
					<a 
						href="/category/{category.slug}" 
						class="hover:text-nordic-blue transition-colors uppercase tracking-wide font-medium"
					>
						{category.name}
					</a>
				{/each}
			</nav>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="md:hidden bg-white border-t border-gray-200">
			<nav class="px-4 pt-2 pb-3 space-y-1">
				<!-- Countries -->
				<a href="/" class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nordic-blue">Home</a>
				<a href="/sweden" data-sveltekit-reload class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nordic-blue">Sweden</a>
				<a href="/norway" data-sveltekit-reload class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nordic-blue">Norway</a>
				<a href="/denmark" data-sveltekit-reload class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nordic-blue">Denmark</a>
				<a href="/finland" data-sveltekit-reload class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nordic-blue">Finland</a>
				<a href="/iceland" data-sveltekit-reload class="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-nordic-blue">Iceland</a>
				
				<!-- Divider -->
				<div class="border-t border-gray-200 my-2"></div>
				
				<!-- Categories -->
				<div class="px-3 py-1">
					<span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categories</span>
				</div>
				{#each categories as category}
					<a href="/category/{category.slug}" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-nordic-blue">{category.name}</a>
				{/each}
				
				<!-- Search -->
				<div class="px-3 py-2">
					<input 
						type="text" 
						placeholder="Search" 
						bind:value={searchQuery}
						on:keydown={(e) => e.key === 'Enter' && handleSearch()}
						class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-nordic-blue focus:border-nordic-blue"
					/>
				</div>
			</nav>
		</div>
	{/if}
</header>
