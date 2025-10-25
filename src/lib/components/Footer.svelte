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
					Your source for Nordic news in English. Get the latest news from Sweden, Norway, Denmark, Finland, and Iceland. Daily coverage of Scandinavian politics, business news, breaking stories, and Nordic culture.
				</p>
			</div>

			<!-- Nordic Countries -->
			<div>
				<h4 class="text-lg font-semibold">Nordic Countries</h4>
				<ul class="mt-4 space-y-2 text-sm">
					<li><a href="/sweden" class="hover:text-nordic-blue transition-colors">Latest News from Sweden</a></li>
					<li><a href="/norway" class="hover:text-nordic-blue transition-colors">Norway News Today</a></li>
					<li><a href="/denmark" class="hover:text-nordic-blue transition-colors">Denmark Breaking News</a></li>
					<li><a href="/finland" class="hover:text-nordic-blue transition-colors">Finland News & Updates</a></li>
					<li><a href="/iceland" class="hover:text-nordic-blue transition-colors">Iceland Current Events</a></li>
				</ul>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="text-lg font-semibold">About</h4>
				<ul class="mt-4 space-y-2 text-sm">
					<li><a href="/about" class="hover:text-nordic-blue transition-colors">About Us</a></li>
					<li><a href="/contact" class="hover:text-nordic-blue transition-colors">Contact</a></li>
					<li><a href="/privacy" class="hover:text-nordic-blue transition-colors">Privacy Policy</a></li>
					<li><a href="/terms" class="hover:text-nordic-blue transition-colors">Terms of Service</a></li>
				</ul>
				<div class="mt-6">
					<h5 class="text-sm font-semibold mb-2">Follow Us</h5>
					<div class="flex space-x-3">
						<button class="hover:text-nordic-blue transition-colors" aria-label="Twitter" title="Follow us on Twitter">
							<Twitter size={20} />
						</button>
						<button class="hover:text-nordic-blue transition-colors" aria-label="Facebook" title="Follow us on Facebook">
							<Facebook size={20} />
						</button>
						<button class="hover:text-nordic-blue transition-colors" aria-label="LinkedIn" title="Follow us on LinkedIn">
							<Linkedin size={20} />
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-8 border-t border-gray-300 pt-8 text-center text-sm text-gray-500">
			<p>&copy; {new Date().getFullYear()} Nordics Today. All Rights Reserved.</p>
		</div>
	</div>
</footer>
