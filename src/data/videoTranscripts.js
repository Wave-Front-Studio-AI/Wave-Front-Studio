// Text versions of the studio's videos, for anyone who cannot hear or see them
// (WCAG 1.2.3). Speech follows the scripts the videos were made from (docs/video-scripts);
// the matching captions are the .vtt files beside each video. "On screen"
// lines carry the text and graphics that are shown but not spoken.
const endCard = 'Wavefront Studio: wavefrontstudiollc.com, (941) 415-2595, info@wavefrontstudiollc.com.'
const contactCard = 'wavefrontstudiollc.com, (941) 415-2595, info@wavefrontstudiollc.com, @wavefrontstudio on Instagram.'

export const videoTranscripts = {
  '/videos/web-development-ad-v2.mp4': [
    ['Presenter', 'Most business websites look fine. And bring in nothing. We build sites where visitors understand you and the next step is one tap.'],
    ['On screen', `The closing card: ${endCard}`],
  ],
  '/videos/seo-google-presence-ad.mp4': [
    ['On screen', 'A Google search for “contractor near me”.'],
    ['Presenter', 'When your customer searches for what you offer, they’re not looking for every business in Sarasota. They’re looking for businesses they can actually find. If that page isn’t clear, easy to navigate, and built to guide someone towards taking action, more traffic is not going to solve the problem.'],
    ['On screen', 'Can customers find your business? A list of search results, with one highlighted.'],
    ['Presenter', 'Can customers find your business? Find out where you stand and take the online presence assessment with Wavefront.'],
    ['On screen', `Find out where you stand: Online Presence Assessment. ${contactCard}`],
  ],
  '/videos/lead-capture-ad-v2.mp4': [
    ['Presenter', 'The click isn’t the win. The reply is. We capture each enquiry, qualify it, and alert the right person right away. Don’t just get the click. Be ready for what comes next.'],
    ['On screen', `The closing card: ${endCard}`],
  ],
  '/videos/free-audit-ad-v2.mp4': [
    ['Presenter', 'Your website may be costing you enquiries. Our free audit checks mobile, speed, search visibility and your enquiry path. Then it lists what to fix first. Free, no obligation.'],
    ['On screen', `The closing card: ${endCard}`],
  ],
  '/videos/mobile-app-ad-v2.mp4': [
    ['Presenter', 'Your customers live on their phones. We design and build iOS and Android apps, for your customers or your team. From first version to finished product.'],
    ['On screen', `The closing card: ${endCard}`],
  ],
}
