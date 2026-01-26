<script lang="ts">
  import { onMount } from 'svelte';
  
  let title = "Editorial Policy | Nordics Today";
  let description = "Our editorial standards, fact-checking process, and commitment to accurate, independent Nordic news coverage.";
  
  onMount(() => {
    // Set page title
    document.title = title;
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12">
  <!-- Page Header -->
  <header class="mb-12">
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
      Editorial Policy
    </h1>
    <p class="text-lg text-gray-600">
      Our commitment to accuracy, transparency, and editorial independence
    </p>
    <p class="text-sm text-gray-500 mt-2">
      Last Updated: November 2025
    </p>
  </header>

  <!-- Mission -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      Nordics Today is dedicated to providing the English-speaking world with comprehensive, accurate, and insightful coverage of news, culture, and developments across the Nordic region—Sweden, Norway, Denmark, Finland, and Iceland.
    </p>
    <p class="text-lg text-gray-700 leading-relaxed mt-4">
      We bridge the language barrier, making Nordic news accessible to international audiences, expats, students, business professionals, and anyone interested in Scandinavian affairs.
    </p>
  </section>

  <!-- Editorial Standards -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold text-gray-900 mb-6">Editorial Standards</h2>
    
    <div class="space-y-8">
      <!-- Accuracy -->
      <div class="border-l-4 border-blue-600 pl-6">
        <h3 class="text-2xl font-semibold text-gray-900 mb-3">1. Accuracy and Verification</h3>
        <p class="text-gray-700 mb-2 font-semibold">We are committed to factual accuracy in all our reporting.</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Every story is sourced from established Nordic news organizations and official sources</li>
          <li>We verify information through multiple credible sources before publication</li>
          <li>Facts are cross-referenced with official government announcements, press releases, and trusted media outlets</li>
          <li>When information cannot be independently verified, we clearly state this in our reporting</li>
        </ul>
      </div>

      <!-- Source Attribution -->
      <div class="border-l-4 border-blue-600 pl-6">
        <h3 class="text-2xl font-semibold text-gray-900 mb-3">2. Content Sources</h3>
        <p class="text-gray-700 mb-2 font-semibold">Our coverage draws from publicly available Nordic news and official sources.</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Content is informed by reporting from established Nordic media organizations</li>
          <li>Official government announcements and press releases are referenced where relevant</li>
          <li>Articles are written for English-speaking audiences with appropriate regional context</li>
          <li>Original reporting and analysis form the foundation of our coverage</li>
        </ul>
      </div>

      <!-- Editorial Independence -->
      <div class="border-l-4 border-blue-600 pl-6">
        <h3 class="text-2xl font-semibold text-gray-900 mb-3">3. Editorial Independence</h3>
        <p class="text-gray-700 mb-2 font-semibold">Our editorial decisions are made independently and objectively.</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>We maintain editorial independence from political parties, governments, and commercial interests</li>
          <li>Our coverage is guided by newsworthiness and relevance to our audience</li>
          <li>We do not accept payment for editorial content or favorable coverage</li>
          <li>Sponsored content, if ever published, will be clearly labeled as such</li>
        </ul>
      </div>

      <!-- Fact-Checking -->
      <div class="border-l-4 border-blue-600 pl-6">
        <h3 class="text-2xl font-semibold text-gray-900 mb-3">4. Fact-Checking Process</h3>
        <p class="text-gray-700 mb-2 font-semibold">Every article undergoes review before publication.</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Stories undergo review for accuracy and clarity before publication</li>
          <li>Statistical data and figures are verified against official sources</li>
          <li>Quotes and statements are checked for accuracy and proper context</li>
          <li>Corrections are made promptly when errors are identified</li>
        </ul>
      </div>

      <!-- Balance and Fairness -->
      <div class="border-l-4 border-blue-600 pl-6">
        <h3 class="text-2xl font-semibold text-gray-900 mb-3">5. Balance and Fairness</h3>
        <p class="text-gray-700 mb-2 font-semibold">We strive for balanced, fair coverage of all topics.</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Multiple perspectives are presented on controversial issues when relevant</li>
          <li>We avoid sensationalism and misleading headlines</li>
          <li>Context is provided to help readers understand complex Nordic affairs</li>
          <li>We respect diverse viewpoints while maintaining factual accuracy</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Corrections Policy -->
  <section class="mb-12 bg-blue-50 p-8 rounded-lg">
    <h2 class="text-3xl font-bold text-gray-900 mb-4">Corrections Policy</h2>
    <p class="text-gray-700 mb-4 font-semibold">We take accuracy seriously and correct errors promptly.</p>
    
    <h3 class="text-xl font-semibold text-gray-900 mb-2">When We Make Mistakes</h3>
    <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
      <li>Corrections are made as soon as errors are identified</li>
      <li>Significant corrections are noted at the top of the article</li>
      <li>Minor corrections (typos, spelling) are made without notification</li>
      <li>We maintain transparency about what was corrected and why</li>
    </ul>

    <h3 class="text-xl font-semibold text-gray-900 mb-2">How to Report Errors</h3>
    <p class="text-gray-700 mb-2">If you believe we have published inaccurate information:</p>
    <ol class="list-decimal list-inside space-y-2 text-gray-700">
      <li>Contact us at: <a href="mailto:info@nordicstoday.com" class="text-blue-600 hover:underline">info@nordicstoday.com</a></li>
      <li>Include the article URL and specific error details</li>
      <li>Provide sources or evidence for the correct information</li>
      <li>We will investigate and respond within 48 hours</li>
    </ol>
  </section>

  <!-- Editorial Approach -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold text-gray-900 mb-4">Editorial Approach</h2>
    
    <h3 class="text-2xl font-semibold text-gray-900 mb-3">Regional Expertise</h3>
    <p class="text-gray-700 mb-4">Nordics Today's coverage is built on:</p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
      <li><strong>Continuous monitoring</strong> of Nordic news sources and official channels</li>
      <li><strong>Deep familiarity</strong> with Nordic languages, cultures, and political systems</li>
      <li><strong>Regional focus</strong> on Sweden, Norway, Denmark, Finland, and Iceland</li>
      <li><strong>Commitment</strong> to accurate, balanced, and accessible reporting</li>
    </ul>

    <h3 class="text-2xl font-semibold text-gray-900 mb-3">Content Standards</h3>
    <p class="text-gray-700">
      All content undergoes review for accuracy, clarity, and relevance to English-speaking audiences. The platform maintains consistent editorial standards across all Nordic coverage areas.
    </p>
  </section>

  <!-- Our Commitment -->
  <section class="mb-12 bg-gray-100 p-8 rounded-lg">
    <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start">
        <span class="text-green-600 text-2xl mr-3">✓</span>
        <div>
          <strong class="text-gray-900">Accuracy</strong>
          <p class="text-gray-700">in all reporting</p>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-green-600 text-2xl mr-3">✓</span>
        <div>
          <strong class="text-gray-900">Transparency</strong>
          <p class="text-gray-700">in our editorial process</p>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-green-600 text-2xl mr-3">✓</span>
        <div>
          <strong class="text-gray-900">Independence</strong>
          <p class="text-gray-700">from outside influence</p>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-green-600 text-2xl mr-3">✓</span>
        <div>
          <strong class="text-gray-900">Fairness</strong>
          <p class="text-gray-700">in coverage</p>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-green-600 text-2xl mr-3">✓</span>
        <div>
          <strong class="text-gray-900">Accountability</strong>
          <p class="text-gray-700">to our readers</p>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-green-600 text-2xl mr-3">✓</span>
        <div>
          <strong class="text-gray-900">Excellence</strong>
          <p class="text-gray-700">in journalism</p>
        </div>
      </div>
    </div>
    <p class="text-gray-700 mt-6 text-center italic">
      We take our responsibility seriously and continually work to earn and maintain your trust.
    </p>
  </section>

  <!-- Contact -->
  <section class="border-t pt-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
    <div class="space-y-4">
      <div>
        <h3 class="font-semibold text-gray-900">Editorial Inquiries</h3>
        <p class="text-gray-700">
          Email: <a href="mailto:info@nordicstoday.com" class="text-blue-600 hover:underline">info@nordicstoday.com</a>
        </p>
        <p class="text-gray-700">Subject: Editorial Policy or Corrections</p>
      </div>
      <div>
        <h3 class="font-semibold text-gray-900">General Inquiries</h3>
        <p class="text-gray-700">
          Visit our <a href="/contact" class="text-blue-600 hover:underline">Contact Page</a> for other inquiries.
        </p>
      </div>
    </div>
  </section>

  <!-- Footer note -->
  <div class="mt-12 pt-8 border-t text-center text-gray-500 text-sm">
    <p><em>Nordics Today - Your Trusted Source for English Nordic News</em></p>
  </div>
</div>

<style>
  /* Ensure links are styled */
  a {
    @apply text-blue-600 hover:text-blue-800 transition-colors;
  }
</style>
