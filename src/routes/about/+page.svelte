<script lang="ts">
  import SEOHead from '$lib/components/SEOHead.svelte';
</script>

<SEOHead 
  title="About Us - Nordics Today"
  description="Learn about Nordics Today, your trusted source for Nordic news. We translate and deliver the latest news from Sweden, Norway, Denmark, Finland, and Iceland to a global audience."
  type="website"
/>

<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">About Nordics Today</h1>
  
  <div class="prose prose-lg max-w-none">
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
      <p class="mb-4">
        Nordics Today bridges the language gap by bringing you the most important news and analysis from the Nordic countries—Sweden, Norway, Denmark, Finland, and Iceland—translated into English for a global audience.
      </p>
      <p class="mb-4">
        We believe that Nordic perspectives on politics, society, technology, and culture offer valuable insights that deserve to reach beyond language barriers. Our team works around the clock to deliver timely, accurate translations of the most significant stories from the region.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">What We Cover</h2>
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div class="bg-blue-50 p-6 rounded-lg">
          <h3 class="font-semibold text-blue-900 mb-3">🏛️ Politics & Society</h3>
          <p class="text-blue-800 text-sm">
            Government policies, elections, social reforms, and political developments across the Nordic region.
          </p>
        </div>
        <div class="bg-green-50 p-6 rounded-lg">
          <h3 class="font-semibold text-green-900 mb-3">🌱 Environment & Energy</h3>
          <p class="text-green-800 text-sm">
            Climate policies, renewable energy innovations, and environmental initiatives from Nordic leaders.
          </p>
        </div>
        <div class="bg-purple-50 p-6 rounded-lg">
          <h3 class="font-semibold text-purple-900 mb-3">💼 Business & Economy</h3>
          <p class="text-purple-800 text-sm">
            Corporate news, economic trends, startups, and business developments in the Nordic markets.
          </p>
        </div>
        <div class="bg-orange-50 p-6 rounded-lg">
          <h3 class="font-semibold text-orange-900 mb-3">🎨 Culture & Lifestyle</h3>
          <p class="text-orange-800 text-sm">
            Arts, entertainment, social trends, and cultural phenomena from Nordic societies.
          </p>
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Our Countries</h2>
      <div class="space-y-4">
        <div class="border-l-4 border-blue-500 pl-4">
          <h3 class="font-semibold text-gray-900">🇸🇪 Sweden</h3>
          <p class="text-gray-600 text-sm">From Stockholm's tech scene to Gothenburg's green initiatives, we cover Sweden's role as a Nordic powerhouse.</p>
        </div>
        <div class="border-l-4 border-red-500 pl-4">
          <h3 class="font-semibold text-gray-900">🇳🇴 Norway</h3>
          <p class="text-gray-600 text-sm">Oil wealth, sovereign fund decisions, and Norway's transition to renewable energy leadership.</p>
        </div>
        <div class="border-l-4 border-red-600 pl-4">
          <h3 class="font-semibold text-gray-900">🇩🇰 Denmark</h3>
          <p class="text-gray-600 text-sm">Wind energy innovations, Danish design, and progressive social policies from Copenhagen and beyond.</p>
        </div>
        <div class="border-l-4 border-blue-600 pl-4">
          <h3 class="font-semibold text-gray-900">🇫🇮 Finland</h3>
          <p class="text-gray-600 text-sm">Education excellence, technology sector growth, and Finland's unique approach to social welfare.</p>
        </div>
        <div class="border-l-4 border-blue-400 pl-4">
          <h3 class="font-semibold text-gray-900">🇮🇸 Iceland</h3>
          <p class="text-gray-600 text-sm">Geothermal innovations, volcanic activity impacts, and Iceland's remarkable economic recovery stories.</p>
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Our Editorial Process</h2>
      <p class="mb-4">
        Our team of Nordic language specialists and journalists work to ensure accurate, contextual translations that preserve the original meaning and cultural nuances of each story.
      </p>
      <ul class="list-disc pl-6 mb-4">
        <li>We source content from reputable Nordic news outlets</li>
        <li>Stories are translated by native speakers with journalism backgrounds</li>
        <li>Each article includes source attribution and publication details</li>
        <li>We prioritize stories with international relevance and impact</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Why Nordic News Matters</h2>
      <p class="mb-4">
        The Nordic countries consistently rank among the world's happiest, most innovative, and most sustainable societies. Their approaches to:
      </p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Climate action</strong> - Leading global efforts in renewable energy and carbon neutrality</li>
        <li><strong>Social welfare</strong> - Pioneering models for work-life balance and social security</li>
        <li><strong>Technology</strong> - Home to global tech giants and innovative startups</li>
        <li><strong>Democracy</strong> - Transparent governance and high civic engagement</li>
      </ul>
      <p class="mb-4">
        These innovations and policies often serve as models for other nations, making Nordic news globally relevant.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact & Collaboration</h2>
      <p class="mb-4">
        We welcome news tips, story suggestions, and collaboration opportunities. Whether you're a Nordic resident with a story to share or an international reader with questions about Nordic affairs, we'd love to hear from you.
      </p>
      <p class="mb-4">
        <a href="/contact" class="text-blue-600 hover:underline">Get in touch with our editorial team</a> or follow us on social media for daily updates.
      </p>
    </section>

    <div class="bg-gray-50 p-6 rounded-lg mt-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Stay Updated</h3>
      <p class="text-gray-600 mb-4">
        Nordic news moves fast. Bookmark our site and check back regularly for the latest developments from across the region.
      </p>
      <div class="flex space-x-4">
        <a href="/" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Latest News
        </a>
        <a href="/contact" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  </div>
</div>
