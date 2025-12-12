<script lang="ts">
  import { enhance } from '$app/forms';
  import { marked } from 'marked';
  
  let isSubmitting = false;
  let submitSuccess = false;
  let submitError = '';
  let wordCount = 0;
  let contentText = '';
  let showPreview = false;
  let contentTextarea: HTMLTextAreaElement;
  
  function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  }
  
  function handleContentInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    contentText = target.value;
    wordCount = countWords(target.value);
  }
  
  function insertMarkdown(type: string) {
    if (!contentTextarea) return;
    
    const start = contentTextarea.selectionStart;
    const end = contentTextarea.selectionEnd;
    const selectedText = contentText.substring(start, end);
    let insertion = '';
    let cursorOffset = 0;
    
    switch (type) {
      case 'bold':
        insertion = `**${selectedText || 'bold text'}**`;
        cursorOffset = selectedText ? insertion.length : 2;
        break;
      case 'italic':
        insertion = `*${selectedText || 'italic text'}*`;
        cursorOffset = selectedText ? insertion.length : 1;
        break;
      case 'h2':
        insertion = `\n## ${selectedText || 'Heading'}\n`;
        cursorOffset = selectedText ? insertion.length : 4;
        break;
      case 'h3':
        insertion = `\n### ${selectedText || 'Subheading'}\n`;
        cursorOffset = selectedText ? insertion.length : 5;
        break;
      case 'list':
        insertion = `\n- ${selectedText || 'List item'}\n`;
        cursorOffset = selectedText ? insertion.length : 3;
        break;
      case 'numbered':
        insertion = `\n1. ${selectedText || 'List item'}\n`;
        cursorOffset = selectedText ? insertion.length : 4;
        break;
      case 'link':
        insertion = `[${selectedText || 'link text'}](url)`;
        cursorOffset = selectedText ? insertion.length - 4 : 1;
        break;
      case 'quote':
        insertion = `\n> ${selectedText || 'Quote'}\n`;
        cursorOffset = selectedText ? insertion.length : 3;
        break;
    }
    
    contentText = contentText.substring(0, start) + insertion + contentText.substring(end);
    wordCount = countWords(contentText);
    
    // Restore focus and cursor position
    setTimeout(() => {
      contentTextarea.focus();
      const newPos = start + (selectedText ? insertion.length : cursorOffset);
      contentTextarea.setSelectionRange(newPos, newPos);
    }, 0);
  }
  
  function renderMarkdown(text: string): string {
    if (!text) return '<p class="text-gray-400 italic">Preview will appear here...</p>';
    try {
      return marked(text) as string;
    } catch {
      return text;
    }
  }
</script>

<svelte:head>
  <title>Submit an Opinion Piece - Nordics Today</title>
  <meta name="description" content="Submit your expert opinion or analysis on Nordic affairs. We welcome contributions from academics, researchers, and industry professionals." />
  <meta name="robots" content="index, follow" />
</svelte:head>

<main class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-3xl mx-auto px-4">
    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Submit an Opinion Piece</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Share your expertise with our readers. We welcome well-researched perspectives from academics, 
        researchers, and industry professionals on topics affecting the Nordic region.
      </p>
    </div>

    <!-- Guidelines -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h2 class="font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Submission Guidelines
      </h2>
      <ul class="text-sm text-blue-800 space-y-2">
        <li><strong>Length:</strong> 800-1,500 words</li>
        <li><strong>Topics:</strong> Nordic business, politics, society, technology, or culture</li>
        <li><strong>Style:</strong> Clear, accessible language suitable for a general audience</li>
        <li><strong>Original:</strong> Previously unpublished work only</li>
        <li><strong>Credentials:</strong> Must include verifiable professional affiliation</li>
      </ul>
    </div>

    <!-- Success Message -->
    {#if submitSuccess}
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-green-800">Submission Received!</h3>
            <p class="text-green-700 mt-1">
              Thank you for your contribution. Our editorial team will review your submission and 
              contact you within 5-7 business days. You will receive a confirmation email shortly.
            </p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Submission Form -->
      <form 
        method="POST" 
        action="/contribute"
        use:enhance={() => {
          isSubmitting = true;
          submitError = '';
          return async ({ result }) => {
            isSubmitting = false;
            if (result.type === 'success') {
              submitSuccess = true;
            } else if (result.type === 'failure') {
              submitError = result.data?.message || 'Submission failed. Please try again.';
            }
          };
        }}
        class="bg-white rounded-lg shadow-md p-8"
      >
        <!-- Error Message -->
        {#if submitError}
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p class="text-red-800">{submitError}</p>
          </div>
        {/if}

        <!-- Section: Author Information -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Author Information
          </h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                placeholder="Anna Lindqvist"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                placeholder="anna.lindqvist@university.se"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Professional Title <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required
                placeholder="Associate Professor of Economics"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label for="institution" class="block text-sm font-medium text-gray-700 mb-1">
                Institution/Organization <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="institution" 
                name="institution" 
                required
                placeholder="Stockholm School of Economics"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div class="mt-4">
            <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
              Author Bio (50-100 words) <span class="text-red-500">*</span>
            </label>
            <textarea 
              id="bio" 
              name="bio" 
              rows="3" 
              required
              placeholder="A brief biography highlighting your expertise, current role, and relevant research or professional experience (50-100 words)."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label for="linkedin" class="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile URL
              </label>
              <input 
                type="url" 
                id="linkedin" 
                name="linkedin"
                placeholder="https://linkedin.com/in/yourprofile"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label for="website" class="block text-sm font-medium text-gray-700 mb-1">
                Personal/Institutional Website
              </label>
              <input 
                type="url" 
                id="website" 
                name="website"
                placeholder="https://yourorganization.com/profile"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Section: Article -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Your Article
          </h2>
          
          <div class="mb-4">
            <label for="article_title" class="block text-sm font-medium text-gray-700 mb-1">
              Article Title <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="article_title" 
              name="article_title" 
              required
              placeholder="The Future of Nordic Green Energy Policy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div class="mb-4">
            <label for="summary" class="block text-sm font-medium text-gray-700 mb-1">
              Summary (150-200 characters) <span class="text-red-500">*</span>
            </label>
            <textarea 
              id="summary" 
              name="summary" 
              rows="2" 
              required
              maxlength="200"
              placeholder="A brief summary of your main argument or thesis in 1-2 sentences."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <div class="flex justify-between items-center mb-1">
              <label for="content" class="block text-sm font-medium text-gray-700">
                Article Content <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center gap-3">
                <span class="text-sm {wordCount < 800 ? 'text-amber-600' : wordCount > 1500 ? 'text-red-600' : 'text-green-600'}">
                  {wordCount} / 800-1,500 words
                </span>
                <button 
                  type="button"
                  on:click={() => showPreview = !showPreview}
                  class="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
            </div>
            
            <!-- Markdown Toolbar -->
            <div class="flex flex-wrap gap-1 p-2 bg-gray-100 border border-gray-300 border-b-0 rounded-t-md">
              <button type="button" on:click={() => insertMarkdown('bold')} class="px-2 py-1 text-sm font-bold bg-white border border-gray-300 rounded hover:bg-gray-50" title="Bold">B</button>
              <button type="button" on:click={() => insertMarkdown('italic')} class="px-2 py-1 text-sm italic bg-white border border-gray-300 rounded hover:bg-gray-50" title="Italic">I</button>
              <span class="border-l border-gray-300 mx-1"></span>
              <button type="button" on:click={() => insertMarkdown('h2')} class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50" title="Heading">H2</button>
              <button type="button" on:click={() => insertMarkdown('h3')} class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50" title="Subheading">H3</button>
              <span class="border-l border-gray-300 mx-1"></span>
              <button type="button" on:click={() => insertMarkdown('list')} class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50" title="Bullet List">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <button type="button" on:click={() => insertMarkdown('numbered')} class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50" title="Numbered List">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
              </button>
              <span class="border-l border-gray-300 mx-1"></span>
              <button type="button" on:click={() => insertMarkdown('link')} class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50" title="Link">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </button>
              <button type="button" on:click={() => insertMarkdown('quote')} class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50" title="Quote">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </button>
            </div>
            
            {#if showPreview}
              <!-- Preview Mode -->
              <div class="w-full min-h-[300px] px-4 py-3 border border-gray-300 rounded-b-md bg-white prose prose-sm max-w-none">
                {@html renderMarkdown(contentText)}
              </div>
              <input type="hidden" name="content" value={contentText} />
            {:else}
              <!-- Edit Mode -->
              <textarea 
                bind:this={contentTextarea}
                bind:value={contentText}
                id="content" 
                name="content" 
                rows="15" 
                required
                on:input={handleContentInput}
                placeholder="Write your full article here. Use clear paragraphs and structure your argument logically. You may include subheadings to organize longer pieces."
                class="w-full px-3 py-2 border border-gray-300 rounded-b-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              ></textarea>
            {/if}
            <p class="text-xs text-gray-500 mt-1">
              Supports Markdown: **bold**, *italic*, ## Heading, - lists, [links](url)
            </p>
          </div>
          
          <div>
            <label for="topics" class="block text-sm font-medium text-gray-700 mb-1">
              Topics (select all that apply) <span class="text-red-500">*</span>
            </label>
            <div class="flex flex-wrap gap-3 mt-2">
              {#each ['Business', 'Politics', 'Society', 'Technology', 'Finance', 'Environment', 'Education', 'Healthcare'] as topic}
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="topics" value={topic.toLowerCase()} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-gray-700">{topic}</span>
                </label>
              {/each}
            </div>
          </div>
        </div>

        <!-- Section: Disclosures -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Disclosures & Agreement
          </h2>
          
          <div class="mb-4">
            <label for="conflict" class="block text-sm font-medium text-gray-700 mb-1">
              Conflict of Interest Disclosure
            </label>
            <textarea 
              id="conflict" 
              name="conflict" 
              rows="2"
              placeholder="Example: 'This research was funded by the Swedish Research Council' or 'The author has no conflicts of interest to declare.'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="original_work" required class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="text-sm text-gray-700">
                I confirm this is my original work and has not been published elsewhere. <span class="text-red-500">*</span>
              </span>
            </label>
            
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="agree_terms" required class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="text-sm text-gray-700">
                I agree to the <a href="/terms" class="text-blue-600 hover:underline">Terms of Service</a> and 
                <a href="/editorial-policy" class="text-blue-600 hover:underline">Editorial Policy</a>. 
                I understand opinion pieces represent my views only and not those of Nordics Today. <span class="text-red-500">*</span>
              </span>
            </label>
            
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="agree_edit" required class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="text-sm text-gray-700">
                I grant Nordics Today the right to edit for style, length, and clarity while preserving 
                the substance of my argument. <span class="text-red-500">*</span>
              </span>
            </label>

            <label class="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="agree_license" required class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="text-sm text-gray-700">
                I grant Nordics Today a non-exclusive, royalty-free, perpetual, worldwide license to publish, 
                distribute, and display my submitted content on the platform and associated channels. I retain 
                copyright ownership and may republish elsewhere after 30 days from publication on Nordics Today. <span class="text-red-500">*</span>
              </span>
            </label>
          </div>

          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-sm font-semibold text-gray-700 mb-2">License Summary</h3>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• <strong>You keep copyright</strong> — your work remains yours</li>
              <li>• <strong>Non-exclusive license</strong> — we can publish, you can too (after 30 days)</li>
              <li>• <strong>No payment</strong> — this is a contributor platform, not paid freelance</li>
              <li>• <strong>Attribution</strong> — your name and bio will appear with your piece</li>
            </ul>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors flex items-center gap-2"
          >
            {#if isSubmitting}
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            {:else}
              Submit for Review
            {/if}
          </button>
        </div>
      </form>
    {/if}

    <!-- Contact Note -->
    <div class="mt-8 text-center text-sm text-gray-500">
      <p>
        Questions about submissions? Contact us at 
        <a href="mailto:info@nordicstoday.com" class="text-blue-600 hover:underline">info@nordicstoday.com</a>
      </p>
    </div>
  </div>
</main>
