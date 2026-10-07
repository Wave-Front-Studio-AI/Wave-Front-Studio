// The pillar page at /ai-search-visibility/. Written as HTML for the .longform
// styles, like the blog posts, but kept out of src/data/generated/ because it is
// a page, not a post, and does not follow the 900-1,060 word post contract.
//
// Every statement about what a vendor does comes from that vendor's own
// documentation, checked on CHECKED. Re-check each row of the table, and the
// sources list, before changing the date. No studio test results belong here
// until the owner decides to publish them.

export const aiSearchGuide = {
  path: '/ai-search-visibility/',
  slug: 'ai-search-visibility',
  title: 'AI Search for Local Businesses: What We Know, What We Do Not, and What to Fix First',
  // Shorter than the headline so Google shows all of it.
  seoTitle: 'AI Search for Local Businesses: What to Fix First',
  description:
    'What Google, OpenAI, Anthropic and Perplexity say about how AI finds local businesses, what nobody outside them knows, and four steps to take first.',
  excerpt:
    'What the vendors have said in their own documentation, what nobody outside them can know, and the order we would fix things in. Sources checked 7 October 2026.',
  published: '2026-10-07',
  modified: '2026-10-07',
  checked: '7 October 2026',
  metaLabel: 'Sources checked 7 October 2026',
  keywords: ['ai search', 'chatgpt', 'google ai overviews', 'ai mode', 'perplexity', 'claude', 'robots.txt', 'llms.txt', 'ai answers', 'guide'],
  linkLabel: 'Read the guide',
  cta: {
    title: 'Want this done for your business?',
    copy: 'Tell us what you sell and where, and we will tell you what we would fix first.',
    label: 'Start Your Project',
  },
  content: `<div class="lf-article">
<p class="lf-standfirst"><strong>A customer asks a chatbot for a business like yours and gets three names. Whether you are one of them depends on things only partly visible from outside. This page separates what the companies have said in writing from what people guess, then puts the useful work in order.</strong></p>

<p>It is a Tuesday evening and a homeowner has a leaking pipe. They do not open a search page. They ask an assistant on their phone: &#8220;Who is a good emergency plumber near me?&#8221; Three businesses come back, each with a sentence of explanation. They ring the first.</p>

<p>If you run a local business, you will want to know whether you were one of the three. You will also be offered a great deal of advice on the subject, much of it confident and little of it sourced. We are a 25-person studio in Sarasota that does <a href="/seo-service/">SEO work</a>, so we have a stake in this, and we would rather tell you plainly where the knowledge runs out.</p>

<p>Every statement about a company&#8217;s crawlers or features comes from that company&#8217;s own documentation, which we read on 7 October 2026.</p>

<nav aria-label="On this page"><h2>On this page</h2>
<ul>
<li><a href="#how-answers-are-made">How AI answers about local businesses are put together</a></li>
<li><a href="#known-and-unknown">What is known, and what is not</a></li>
<li><a href="#step-1-check">Step 1: check where you stand</a></li>
<li><a href="#step-2-crawlers">Step 2: let the right crawlers in</a></li>
<li><a href="#step-3-describe">Step 3: make the business easy to describe</a></li>
<li><a href="#step-4-extras">Step 4: optional extras</a></li>
<li><a href="#no-promises">What we will not promise</a></li>
<li><a href="#repeat-the-test">Repeat the test</a></li>
<li><a href="#questions">Questions owners ask</a></li>
<li><a href="#sources">Sources and check date</a></li>
</ul></nav>

<h2 id="how-answers-are-made">How AI answers about local businesses are put together</h2>

<p>Two different things can sit behind an answer, and they are easy to confuse.</p>

<p>The first is what the model already holds from its training. That is a snapshot of text gathered before a certain date. It can include your business name, if enough of what was gathered mentioned it, and it can be out of date or wrong in ways that are hard to see.</p>

<p>The second is what a search tool fetches while the answer is being written. Many assistants can look things up live: they run a search, read some pages, and write a reply that points to the pages they used. When you see a list of sources under an answer, that is usually this second route at work.</p>

<p>Both routes lean on material that exists inside and outside your control: your website, your Google Business Profile, the reviews people have left, and what directories and other sites say about you. That is why the practical advice further down is dull. It is mostly about making those sources correct, consistent and reachable.</p>

<p>Here is what we cannot tell you, and nobody outside these companies can either: how a given assistant decides which three businesses to name. No vendor publishes the ranking or selection method for local recommendations. Anyone who claims to know the recipe is guessing, or selling something.</p>

<h2 id="known-and-unknown">What is known, and what is not</h2>

<p>The table below lists only what the companies themselves state in their documentation, with the source for each. Where the honest answer is that nobody has published one, the row says so. We checked every row on 7 October 2026. Documentation of this kind changes, so treat the date as part of the claim.</p>

<div class="lf-table-scroll"><table>
<thead><tr><th>Claim</th><th>Source</th><th>Status</th></tr></thead>
<tbody>
<tr><td>Google says there are no additional requirements, special optimisations, new machine-readable files, AI text files or markup needed to appear in AI Overviews or AI Mode.</td><td><a href="https://developers.google.com/search/docs/appearance/ai-features" rel="noopener">Google Search Central, AI features and your website</a></td><td>Confirmed</td></tr>
<tr><td>To be shown as a supporting link in AI Overviews or AI Mode, a page must be indexed and eligible to be shown in Google Search with a snippet.</td><td><a href="https://developers.google.com/search/docs/appearance/ai-features" rel="noopener">Google Search Central, AI features and your website</a></td><td>Confirmed</td></tr>
<tr><td>OAI-SearchBot is OpenAI&#8217;s crawler for surfacing sites in ChatGPT search, and it follows robots.txt. A site that disallows it will not be shown in ChatGPT search answers.</td><td><a href="https://developers.openai.com/api/docs/bots" rel="noopener">OpenAI, crawlers overview</a></td><td>Confirmed</td></tr>
<tr><td>GPTBot is OpenAI&#8217;s crawler for training generative AI models, and it follows robots.txt.</td><td><a href="https://developers.openai.com/api/docs/bots" rel="noopener">OpenAI, crawlers overview</a></td><td>Confirmed</td></tr>
<tr><td>ChatGPT-User acts on a user&#8217;s request, such as visiting a page during a conversation. OpenAI says robots.txt rules may not apply to it.</td><td><a href="https://developers.openai.com/api/docs/bots" rel="noopener">OpenAI, crawlers overview</a></td><td>Confirmed</td></tr>
<tr><td>Anthropic runs three crawlers: ClaudeBot (gathering content for model development), Claude-User (fetching a page when a person asks Claude) and Claude-SearchBot (improving search results). Anthropic says all three honour robots.txt.</td><td><a href="https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler" rel="noopener">Anthropic, how site owners can block its crawlers</a></td><td>Confirmed</td></tr>
<tr><td>PerplexityBot is for surfacing and linking sites in Perplexity search results, is not used for training foundation models, and respects robots.txt.</td><td><a href="https://docs.perplexity.ai/guides/bots" rel="noopener">Perplexity, PerplexityBot and Perplexity-User</a></td><td>Confirmed</td></tr>
<tr><td>Perplexity-User fetches pages when a person asks a question, and Perplexity says it generally ignores robots.txt because a person started the request.</td><td><a href="https://docs.perplexity.ai/guides/bots" rel="noopener">Perplexity, PerplexityBot and Perplexity-User</a></td><td>Confirmed</td></tr>
<tr><td>How any assistant chooses which local businesses to name or recommend.</td><td>Not published by any of the four</td><td>Unknown</td></tr>
<tr><td>Whether a particular change to your own website makes you more likely to be named by ChatGPT, Claude or Perplexity.</td><td>None of the four documents one</td><td>Unknown</td></tr>
<tr><td>Whether an llms.txt file or structured data changes your chances with any assistant.</td><td>Google says neither is needed for its features. The others have not said.</td><td>Unknown</td></tr>
<tr><td>How long a change takes to show up in an answer, if it does.</td><td>Not published</td><td>Unknown</td></tr>
</tbody></table></div>

<p>A few things follow from the table.</p>

<p>First, the confirmed rows are all about access: who is allowed to read your pages, and for what purpose. That is a narrow, checkable area, and it is the part you can act on with certainty.</p>

<p>Second, the unknown rows are all about selection and effect. Those are the questions most people care about, and the vendors have not answered them. Where one has said anything, as Google has, it is that ordinary good search practice is what counts.</p>

<p>Third, one row is easy to skim past. Perplexity and OpenAI both say their user-triggered fetchers may ignore robots.txt. A robots.txt file is a request that well-behaved crawlers choose to follow. It is not a lock.</p>

<blockquote class="lf-callout"><p><strong>What the table does not say</strong></p>
<p>Nothing here says that allowing a crawler will get you named, or that blocking one will keep you out of every answer. It says what each crawler is for and whether it follows your instructions. Everything beyond that is outside what the vendors have published.</p></blockquote>

<h2 id="step-1-check">Step 1: check where you stand</h2>

<p>Before you change anything, find out what customers see now. This costs nothing and takes an afternoon. We describe the method in full in our guide to <a href="/check-whether-chatgpt-or-google-ai-names-your-business/">checking whether ChatGPT or Google AI names your business</a>. This is the short version.</p>

<h3>The method</h3>

<ol>
<li><strong>Write five questions in the words a customer would use.</strong> Two about your service in your area, one comparing options, one about price or timing, and one that describes a problem rather than naming a service.</li>
<li><strong>Choose your engines.</strong> At minimum ChatGPT and Google, meaning both the AI Overview on the results page and AI Mode if you have it. Add Claude or Perplexity if your customers are likely to use them.</li>
<li><strong>Use a clean session.</strong> A logged-out or private window, with a new chat for every run. Some tools adjust replies using your approximate location or earlier conversations, and you cannot fully switch that off, so note it.</li>
<li><strong>Run each question three to five times on each engine.</strong> A reply is written fresh each time, so the same question can name different businesses on different runs.</li>
<li><strong>Record every answer in full</strong>, with the sources it lists and the date. Keep screenshots as backup.</li>
</ol>

<h3>What to write down for each answer</h3>

<div class="lf-table-scroll"><table>
<thead><tr><th>Column</th><th>What goes in it</th></tr></thead>
<tbody>
<tr><td>Date and engine</td><td>For example &#8220;7 October, ChatGPT with search on&#8221;, and whether the window was private</td></tr>
<tr><td>Question and run number</td><td>Which of the five questions, and which attempt</td></tr>
<tr><td>Cited</td><td>Yes or no: is your website listed as a source or linked?</td></tr>
<tr><td>Mentioned</td><td>Yes or no: does your business name appear in the text?</td></tr>
<tr><td>Recommended</td><td>Yes or no: does the answer point the customer to you as a good choice?</td></tr>
<tr><td>Others named</td><td>The other businesses and the pages cited for them</td></tr>
<tr><td>Anything wrong</td><td>Wrong address, wrong phone number, a service you do not offer, a business that closed</td></tr>
</tbody></table></div>

<p>Keep cited, mentioned and recommended apart. They are different results with different causes. A page can be cited to explain a general point without you being recommended. A name can appear because of a directory listing, with no link to your site at all.</p>

<p>Write the result as a plain count, such as &#8220;mentioned in 2 of 5 runs, cited in none, recommended in 1&#8221;. Do not convert it into a percentage or a score. A handful of runs cannot carry that much precision, and a neat figure would look more certain than the evidence is.</p>

<h2 id="step-2-crawlers">Step 2: let the right crawlers in</h2>

<p>This is the one step where the facts are firm. Your <strong>robots.txt</strong> file is a plain text file at the root of your site that tells crawlers which parts they may read. Mistakes in it are common, usually left over from a redesign or added by a plugin, and they can quietly keep a business out of the tools that fetch live pages.</p>

<p>The crawlers fall into three groups by purpose, and the useful way to think about them is by what you are agreeing to.</p>

<div class="lf-table-scroll"><table>
<thead><tr><th>Purpose</th><th>Crawlers</th><th>What blocking them does</th></tr></thead>
<tbody>
<tr><td>Search and answers: surfaces your pages in a product&#8217;s search results</td><td>Googlebot, OAI-SearchBot, Claude-SearchBot, PerplexityBot</td><td>OpenAI says a site that disallows OAI-SearchBot will not be shown in ChatGPT search answers. For the others, expect the same direction of effect, though the exact result is the vendor&#8217;s to define.</td></tr>
<tr><td>Training: gathers content to build or improve models</td><td>GPTBot, ClaudeBot</td><td>Tells the vendor your content should not be used for training. It is about training, not about being found.</td></tr>
<tr><td>Fetching on a person&#8217;s request: reads a page because someone asked about it</td><td>ChatGPT-User, Claude-User, Perplexity-User</td><td>Claude-User honours robots.txt. OpenAI says robots.txt may not apply to ChatGPT-User, and Perplexity says Perplexity-User generally ignores it.</td></tr>
</tbody></table></div>

<p>The choice about training is yours, and it is a business decision rather than a technical one. Some owners are content for their pages to be used. Others would rather not. Neither is wrong, and OpenAI lists its training crawler and its search crawler separately, so you can treat them differently. If you are unsure, the cautious order is to allow the search crawlers first and decide about training deliberately.</p>

<p>This is the shape of the file on our own site: search and AI-search crawlers are welcome, and crawlers that exist to gather training data are not.</p>

<pre><code># Search engines and AI search tools: welcome.
User-agent: *
Allow: /

# Crawlers that collect AI training data: no thanks.
User-agent: GPTBot
User-agent: ClaudeBot
Disallow: /

Sitemap: https://www.example.com/sitemap.xml</code></pre>

<h3>How to check yours in ten minutes</h3>

<ol>
<li>Open <code>yourdomain.com/robots.txt</code> in a browser. If it returns an error page, you have no file, which usually means everything is allowed.</li>
<li>Look for a line reading <code>Disallow: /</code> under <code>User-agent: *</code>. That blocks every crawler that follows the file, and it is the commonest accidental setting after a site is built on a staging address.</li>
<li>Look for any group naming OAI-SearchBot, Claude-SearchBot, PerplexityBot or Googlebot. If there is one, confirm it is intentional.</li>
<li>Confirm in Google Search Console that your key pages are indexed. Google says a page must be indexed and eligible for a snippet to appear as a supporting link in its AI features, so this is not optional.</li>
</ol>

<p>Be clear about the limit. robots.txt controls the crawlers that choose to obey it. It will not stop a person pasting your address into an assistant, and it will not remove content that has already been gathered.</p>

<h2 id="step-3-describe">Step 3: make the business easy to describe</h2>

<p>This is the largest piece of work and the least exciting. If an assistant is going to name you, it needs to be able to work out, from sources it trusts, who you are, what you do and where. Nobody has published which sources count most. The sensible course is to make all of them say the same true thing.</p>

<h3>Your website</h3>

<ul>
<li><strong>One page per service.</strong> A page called &#8220;Services&#8221; that lists eight things in a paragraph is hard to quote. A page that says what you do, for whom, how it works and roughly what it involves is easy to describe.</li>
<li><strong>Say where you work.</strong> Name the towns or counties you serve, on a page a person can read. Do not leave the area implied.</li>
<li><strong>Put your name, address and phone number in the same form everywhere.</strong> Footer, contact page, Google Business Profile and directories. Small differences, such as &#8220;Ct&#8221; in one place and &#8220;Court&#8221; in another, are the kind of inconsistency that causes mismatches.</li>
<li><strong>Answer the questions customers ask you.</strong> Prices where you can give them, timings, what happens first. Plain answers are useful to people and easy to lift into a reply.</li>
</ul>

<h3>Your Google Business Profile</h3>

<p>For a local business this is often the most-viewed page about you anywhere. Complete it: categories, hours, services, service area, photos, and a description that matches the website. We cover the reasoning in <a href="/google-business-profile-does-more-than-your-website/">why your Google Business Profile does more than your website</a>. We cannot say how much weight any assistant gives it. We can say that it is the first place a customer looks, so it needs to be right whatever the assistants do.</p>

<h3>Reviews</h3>

<p>Ask real customers for reviews on Google, where they belong, and reply to the ones you receive. Do not write your own, do not pay for them, and do not copy them onto your site as text, because that is not what the platform&#8217;s terms allow. If your site shows reviews, show them live from Google as they were written.</p>

<h3>Other sites that mention you</h3>

<p>Check the directories, chamber of commerce pages, trade bodies and local press that list you. Fix wrong details at the source. This is slow, and it is also the work that tends to be skipped, which is why it is worth doing.</p>

<p>If you would like this done by someone else, it is the core of our <a href="/seo-service/">SEO service</a>. The same groundwork serves ordinary search and AI answers alike, which is the main reason we recommend it: it still pays if the AI tools change their minds.</p>

<h2 id="step-4-extras">Step 4: optional extras</h2>

<p>Everything in this section is low effort and unproven. We list it because owners ask, not because we can show it works.</p>

<h3>An llms.txt file</h3>

<p>This is a plain text file that lists the main pages of a site, written for AI tools to read. Google says you do not need new machine-readable files or AI text files to appear in AI Overviews or AI Mode. The other vendors have not said that they use such a file. It costs little to make, and we publish one on this site, but we make no claim that it brings a single mention. If you add one, treat it as housekeeping.</p>

<h3>Structured data</h3>

<p>Structured data, often called schema markup, is a block of code that states facts about a page in a fixed format. It has real uses in ordinary search, such as helping Google understand a page and sometimes enabling richer results. For AI answers, Google says no special markup is needed. We still add accurate markup for a business&#8217;s name, address and services, because it is cheap and it helps in other ways. We do not tell clients it will get them named.</p>

<p>One rule if you do use it: the markup has to match what is on the page. Markup that describes things a visitor cannot see is worse than none.</p>

<h2 id="no-promises">What we will not promise</h2>

<p>Because the selection method is not public, no honest provider can promise an outcome. So here is what we will not say to you, and what you should be wary of hearing from anyone else.</p>

<ul>
<li><strong>That you will be named.</strong> No guaranteed mentions, citations or recommendations, in any assistant, on any date.</li>
<li><strong>That you will hold a position.</strong> There is no ranking of AI answers to hold. Replies change from run to run, so there is no equivalent of &#8220;page one&#8221;. Our guide to <a href="/seo-company-that-guarantees-page-one/">SEO companies that guarantee page one</a> explains why that kind of promise is a warning sign even in ordinary search.</li>
<li><strong>A timeline.</strong> The vendors do not say how long a change takes to be noticed, so we cannot either. Some changes may never show.</li>
<li><strong>A secret method.</strong> If someone says they have found the formula that these companies keep private, ask to see how they know. We have not found one that the vendors confirm.</li>
<li><strong>Control.</strong> We cannot decide what an assistant says about you. We can make sure what it can read is accurate.</li>
</ul>

<p>What we can promise is the work itself: checking access, tidying the sources, writing clear pages, and measuring before and after in the same way each time. That is a process, not a result, and we describe it as one.</p>

<h2 id="repeat-the-test">Repeat the test</h2>

<p>One run of the test is a snapshot. The useful version is the same test, run the same way, every three months. Keep the five questions unchanged so the runs can be compared, and write down anything that changed on your side in between: a new service page, a corrected listing, a reworked robots.txt.</p>

<p>When you compare two rounds, resist reading too much into small differences. Because answers vary from run to run, a change from two mentions to three is within the normal wobble. Look instead for patterns that hold across rounds: a competitor who is always named, a wrong fact that keeps appearing, a page that is now cited and was not before.</p>

<h2 id="questions">Questions owners ask</h2>

<h3>Do I need special markup or files to appear in Google&#8217;s AI answers?</h3>
<p>Google says no. Its documentation states that there are no additional requirements and no special optimisations, and that you do not need new machine-readable files, AI text files or markup. A page does need to be indexed and eligible to show in Google Search with a snippet.</p>

<h3>If I block GPTBot, will ChatGPT stop recommending me?</h3>
<p>OpenAI describes GPTBot as the crawler for training, and OAI-SearchBot as the one that surfaces sites in ChatGPT search. Disallowing GPTBot is about training. OpenAI says a site that disallows OAI-SearchBot will not be shown in ChatGPT search answers, so that is the one to leave alone if you want to be found there.</p>

<h3>Can I stop an assistant reading my page altogether?</h3>
<p>Not reliably with robots.txt alone. OpenAI says robots.txt rules may not apply to ChatGPT-User, and Perplexity says Perplexity-User generally ignores them because a person started the request. Anthropic says Claude-User honours robots.txt.</p>

<h3>How long until a change shows up?</h3>
<p>Nobody has published a figure, and we will not invent one. Repeat the test every three months and judge by the pattern.</p>

<h3>Is this different from ordinary SEO?</h3>
<p>Mostly not. Google says its AI features rely on the same indexing and eligibility as Search. The extra work is checking that the other vendors&#8217; crawlers can reach you, and keeping your details consistent across the places an assistant might read.</p>

<h2 id="sources">Sources and check date</h2>

<p>All checked on <strong>7 October 2026</strong>. If you are reading this much later, open the pages again before relying on any row of the table.</p>

<ul>
<li>Google Search Central: <a href="https://developers.google.com/search/docs/appearance/ai-features" rel="noopener">AI features and your website</a></li>
<li>OpenAI: <a href="https://developers.openai.com/api/docs/bots" rel="noopener">Overview of OpenAI crawlers</a> (OAI-SearchBot, GPTBot, ChatGPT-User)</li>
<li>Anthropic: <a href="https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler" rel="noopener">Does Anthropic crawl data from the web, and how can site owners block the crawler?</a> (ClaudeBot, Claude-User, Claude-SearchBot)</li>
<li>Perplexity: <a href="https://docs.perplexity.ai/guides/bots" rel="noopener">PerplexityBot and Perplexity-User</a></li>
</ul>

<div class="lf-cta"><h2>Want help with the first steps?</h2>
<p>We can check your robots.txt and crawler access, tidy the pages and listings an assistant would read, and run the prompt test for you in the same way each quarter. We cannot promise to get you named, and we will say so before you pay anything.</p>
<p><a href="/seo-service/">See how our SEO service works</a>, or start with the <a href="/free-website-audit/">free website audit</a>. We reply within two working days.</p></div>

<aside class="lf-related"><h2>Related reading</h2><ul>
<li><a href="/check-whether-chatgpt-or-google-ai-names-your-business/">How to Check Whether ChatGPT or Google AI Names Your Business</a></li>
<li><a href="/google-business-profile-does-more-than-your-website/">Your Google Business Profile Is Doing More Work Than Your Website</a></li>
<li><a href="/seo-keeps-working-after-you-stop-paying/">SEO Is the Only Channel That Keeps Working After You Stop Paying</a></li>
</ul></aside>
</div>`,
}
