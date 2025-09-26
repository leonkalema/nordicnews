<script lang="ts">
	import { Twitter, Facebook, Linkedin } from 'svelte-lucide-icons';
</script>

<footer class="bg-gray-100 text-gray-800 py-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- Site Info -->
			<div class="md:col-span-2">
				<h3 class="text-2xl font-bold">Nordics Today</h3>
				<p class="mt-2 text-sm text-gray-600">
					Your daily source for unbiased news and analysis from across the Nordic region, translated for a global audience.
				</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="text-lg font-semibold">Quick Links</h4>
				<ul class="mt-4 space-y-2">
					<li><a href="/" class="hover:text-nordic-blue transition-colors">Home</a></li>
					<li><a href="/about" class="hover:text-nordic-blue transition-colors">About Us</a></li>
					<li><a href="/contact" class="hover:text-nordic-blue transition-colors">Contact</a></li>
					<li><a href="/privacy" class="hover:text-nordic-blue transition-colors">Privacy Policy</a></li>
				</ul>
			</div>

			<!-- Social Media -->
			<div>
				<h4 class="text-lg font-semibold">Follow Us</h4>
				<div class="mt-4 flex space-x-4">
					<button class="hover:text-nordic-blue transition-colors" aria-label="Twitter" title="Follow us on Twitter">
						<Twitter size={24} />
					</button>
					<button class="hover:text-nordic-blue transition-colors" aria-label="Facebook" title="Follow us on Facebook">
						<Facebook size={24} />
					</button>
					<button class="hover:text-nordic-blue transition-colors" aria-label="LinkedIn" title="Follow us on LinkedIn">
						<Linkedin size={24} />
					</button>
				</div>
			</div>
		</div>

		<div class="mt-8 border-t border-gray-300 pt-8 text-center text-sm text-gray-500">
			<p>&copy; {new Date().getFullYear()} Nordics Today. All Rights Reserved.</p>
		</div>
	</div>
</footer>
