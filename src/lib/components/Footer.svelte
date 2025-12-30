<script lang="ts">
	import { Twitter } from 'svelte-lucide-icons';
</script>

<footer class="bg-white border-t border-gray-200 py-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-12">
			<!-- Site Info -->
			<div class="md:col-span-2">
				<h3 class="font-serif text-2xl font-bold text-gray-900">Nordics Today</h3>
				<p class="mt-4 text-sm text-gray-500 leading-relaxed max-w-md">
					Your source for Nordic news in English. Daily coverage of Sweden, Norway, Denmark, Finland, and Iceland.
				</p>
				<div class="flex space-x-4 mt-6">
					<a href="https://x.com/nordicstoday" target="_blank" rel="noopener" class="text-gray-400 hover:text-black transition-colors" aria-label="Follow us on X">
						<Twitter size={18} />
					</a>
				</div>
			</div>

			<!-- Nordic Countries -->
			<div>
				<h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Countries</h4>
				<ul class="space-y-3 text-sm">
					<li><a href="/sweden" class="text-gray-600 hover:text-black transition-colors">Sweden</a></li>
					<li><a href="/norway" class="text-gray-600 hover:text-black transition-colors">Norway</a></li>
					<li><a href="/denmark" class="text-gray-600 hover:text-black transition-colors">Denmark</a></li>
					<li><a href="/finland" class="text-gray-600 hover:text-black transition-colors">Finland</a></li>
					<li><a href="/iceland" class="text-gray-600 hover:text-black transition-colors">Iceland</a></li>
				</ul>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Company</h4>
				<ul class="space-y-3 text-sm">
					<li><a href="/about" class="text-gray-600 hover:text-black transition-colors">About</a></li>
					<li><a href="/contact" class="text-gray-600 hover:text-black transition-colors">Contact</a></li>
					<li><a href="/contribute" class="text-gray-600 hover:text-black transition-colors">Contribute</a></li>
					<li><a href="/editorial-policy" class="text-gray-600 hover:text-black transition-colors">Editorial Policy</a></li>
					<li><a href="/privacy" class="text-gray-600 hover:text-black transition-colors">Privacy</a></li>
					<li><a href="/terms" class="text-gray-600 hover:text-black transition-colors">Terms</a></li>
					<li><button onclick={() => { localStorage.removeItem('cookie-consent'); location.reload(); }} class="text-gray-600 hover:text-black transition-colors text-left">Cookie Settings</button></li>
				</ul>
			</div>
		</div>

		<div class="mt-12 pt-8 border-t border-gray-100 text-center">
			<p class="text-xs text-gray-400 mb-2">&copy; {new Date().getFullYear()} Nordics Today. All rights reserved.</p>
			<p class="text-xs text-gray-400 italic">Nordics Today uses editorial bylines to organize content by region and topic.</p>
		</div>
	</div>
</footer>
