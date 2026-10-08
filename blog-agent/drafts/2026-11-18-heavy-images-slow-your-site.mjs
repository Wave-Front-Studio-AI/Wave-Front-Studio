// Draft. Not yet published. Scheduled for 2026-11-18.
// Sources fetched 2026-10-08:
//  - web.dev, Choose the right image format: https://web.dev/articles/choose-the-right-image-format
//    (WebP and AVIF generally compress better than older formats; JPEG/PNG as fallbacks; SVG for simple geometric shapes; text in images is not selectable, searchable or zoomable)
//  - web.dev, Browser-level image lazy-loading: https://web.dev/articles/browser-level-image-lazy-loading
//    (loading=lazy only for images outside the initial viewport; do not lazy-load LCP images; add width and height to all img tags)
//  - web.dev, Serve responsive images: https://web.dev/articles/serve-responsive-images (srcset and sizes let the browser choose)
//  - web.dev, Largest Contentful Paint: https://web.dev/articles/lcp (img elements are LCP candidates; good is 2.5 seconds or less)
//  - MDN, the img element: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img (width/height, srcset/sizes, loading, fetchpriority)
//  - Chrome DevTools, Network panel: https://developer.chrome.com/docs/devtools/network (Img filter, Size column)
// The "2 to 4 times more data" line on web.dev was deliberately not used.
export default {
  slug: 'heavy-images-slow-your-site',
  title: 'The Photos You Uploaded Are Probably the Reason Your Site Is Slow',
  date: '2026-11-18',
  excerpt: 'Oversized photos are a common reason a page drags. Here is how to find the heavy ones, which format to use, and which images should never be lazy-loaded.',
  image: '/images/blog/heavy-images-slow-your-site.webp',
  content: [
    `<div class="lf-article">`,
    `<p class="lf-standfirst"><strong>When a small business website feels slow, the first suspect should be the pictures. A photo straight from a modern phone is far larger than any web page needs, and the browser has to download every byte of it.</strong></p>`,
    `<p>Imagine someone updating their gallery page. They take twelve photographs of finished jobs, upload them exactly as they came off the camera, and admire the result on the office computer. It looks lovely. A customer on a phone with two bars of signal is looking at a blank page and a spinning wheel.</p>`,
    `<p>Nothing is broken. The page is simply carrying more than it needs to. Fixing it takes three decisions: the dimensions, the format, and when each image loads.</p>`,
    `<h2>Why images matter more than most things</h2>`,
    `<p>Google's guide to Largest Contentful Paint lists image elements among the things it measures, and describes 2.5 seconds or less as a good result. On many pages the biggest thing a visitor sees first is a photograph. If that photograph is heavy, the page feels late, whatever else you have done.</p>`,
    `<h2>Step 1: find the heavy ones</h2>`,
    `<p>You do not have to guess. In Chrome, open the developer tools, choose the Network panel, reload the page and click the Img filter. The Size column lists what was transferred for each file. Sort it from largest to smallest and the culprits are at the top.</p>`,
    `<p>One detail from Chrome's documentation: the Size column shows the amount transferred over the network, which reflects compression, not the size of the original file on your computer. A figure that looks small there can still hide an oversized original, so compare it with what you uploaded.</p>`,
    `<p>Do it on your homepage, your gallery or product pages, and any page you send people to from advertising or social media.</p>`,
    `<h2>Step 2: size the image for where it appears</h2>`,
    `<p>A picture that displays 600 pixels wide does not need to be 4,000 pixels wide in the file. Resize it to roughly the largest size it will ever be shown, allowing extra for sharp screens.</p>`,
    `<p>A developer can go further with the <code>srcset</code> and <code>sizes</code> attributes, which supply several versions and let the browser pick the best one, as web.dev explains. If your site is built on a platform, many generate these versions for you, so check before you resize by hand.</p>`,
    `<p>Keep the original full-size photograph somewhere safe, and upload a resized copy. You can always shrink a large file later, but you cannot add detail back to a small one.</p>`,
    `<h2>Step 3: choose the right format</h2>`,
    `<p>web.dev's advice is that WebP and AVIF generally compress better than older formats and should be used where possible, with JPEG or PNG as fallbacks. It also recommends SVG for simple geometric images such as logos and icons.</p>`,
    `<figure><table><thead><tr><th>Kind of image</th><th>Sensible format</th></tr></thead>`,
    `<tbody>`,
    `<tr><td><strong>Photographs</strong></td><td>WebP or AVIF, with JPEG as a fallback</td></tr>`,
    `<tr><td><strong>Logos and icons</strong></td><td>SVG</td></tr>`,
    `<tr><td><strong>Screenshots needing every detail</strong></td><td>PNG or lossless WebP</td></tr>`,
    `<tr><td><strong>Short animation</strong></td><td>Video, not a GIF</td></tr>`,
    `</tbody></table></figure>`,
    `<p>Keep words out of images. web.dev points out that text inside an image cannot be selected, searched or zoomed, which also hurts anyone who relies on a screen reader.</p>`,
    `<h2>Step 4: load images at the right moment</h2>`,
    `<p>The <code>loading="lazy"</code> attribute tells a browser to wait on an image until the visitor is close to it. It is useful for images far down a long page. web.dev is explicit that it should only be used for images outside the initial viewport, and that you should not lazy-load images likely to be in view at load, especially the LCP image.</p>`,
    `<p>It also recommends putting <code>width</code> and <code>height</code> attributes on every <code>img</code> tag, so the browser reserves the space and the page does not jump as pictures arrive.</p>`,
    `<blockquote class="lf-callout"><p><strong>Lazy loading the top image makes things worse</strong></p>`,
    `<p>It is tempting to apply lazy loading to every image on the site. Doing that to the large picture at the top of the page delays the very thing the visitor is waiting to see. Leave the first image alone, and lazy-load the ones below it.</p></blockquote>`,
    `<h2>What to do this week</h2>`,
    `<ol>`,
    `<li>List your five heaviest images with the Network panel.</li>`,
    `<li>Check the displayed size of each against the file size, and resize the oversized ones.</li>`,
    `<li>Convert photographs to WebP, or ask whoever manages the site to do it.</li>`,
    `<li>Confirm the top image is not lazy-loaded and the ones below it are.</li>`,
    `<li>Reload on your phone with Wi-Fi off, and see whether it feels different.</li>`,
    `</ol>`,
    `<h2>What not to expect</h2>`,
    `<p>Images are a common reason for a slow page, not the only one. Scripts, plugins, fonts and slow hosting can drag a site down too, and no amount of photo compression will fix those. We cannot tell you from here how much faster your own pages will become.</p>`,
    `<p>Compression also has a limit. Squeeze a photo too hard and it looks smeared, which costs you more than a second saved. Check the results by eye on a phone before you move on.</p>`,
    `<div class="lf-cta"><h2>Not sure what is slowing your pages?</h2>`,
    `<p>We will look at your heaviest pages and tell you which files, scripts and settings are responsible.</p>`,
    `<p><a href="/free-website-audit/">Request the free website audit</a>, or read about our <a href="/web-development/">web design and development</a> work.</p>`,
    `<p>We&#8217;re currently waiving setup fees for five businesses this quarter on AI chatbots, web development and SEO. `,
    `<a href="/free-setup/">See what&#8217;s included</a>, or call <a href="tel:+19414152595">+1 (941) 415-2595</a>.</p></div>`,
    `<aside class="lf-related"><h2>Related reading</h2><ul>`,
    `<li><a href="/nobody-waits-for-a-slow-website/">Nobody Waits for a Slow Website, and Google Stopped Waiting Too</a></li>`,
    `<li><a href="/let-them-see-it-before-they-buy-it/">Let Them See It Before They Buy It</a></li>`,
    `<li><a href="/seo-keeps-working-after-you-stop-paying/">SEO Is the Only Channel That Keeps Working After You Stop Paying</a></li>`,
    `</ul></aside>`,
    `</div>`,
  ].join(''),
}
