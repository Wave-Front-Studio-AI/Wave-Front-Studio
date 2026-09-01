import { answerQuestion, searchKnowledge } from '../src/chatKnowledge.js'
import { detectLanguage, translateQuery } from '../src/chatLanguage.js'

// One realistic question for every published route, plus ambiguous, unsupported,
// off-topic, place-name collision, and multilingual cases. This is intentionally
// data rather than a test runner so reviewers can inspect every answer and score.
const routeCases = [
  ['/', 'What does Wavefront Studio do?'],
  ['/about/', 'Who is behind Wavefront Studio?'],
  ['/portfolio/', 'Can I see examples of your work?'],
  ['/contact/', 'What is your contact information?'],
  ['/faqs/', 'What questions do customers usually ask before starting?'],
  ['/blog/', 'Where can I read your articles?'],
  ['/lost-lead-calculator/', 'How much revenue am I losing from missed leads?'],
  ['/free-setup/', 'What setup fees are free this quarter?'],
  ['/build-your-package/', 'Where can I build a package and see the total price?'],
  ['/locations/', 'Which areas do you work in?'],
  ['/services/', 'Show me all your services'],
  ['/custom-works/', 'What custom tools do you build?'],
  ['/web-development/', 'My website is old and needs a redesign'],
  ['/web-development/', 'Can you make a WooCommerce store?'],
  ['/seo-service/', 'I want to rank higher on Google'],
  ['/seo-service/', 'Do you improve Google Business Profiles?'],
  ['/seo-service/', 'seo'],
  ['/seo-service/', 'what is seo'],
  ['/mobile-app-development/', 'Can you build an iPhone and Android app?'],
  ['/mobile-app-development/', 'We need an MVP for our startup'],
  ['/social-media-strategy/', 'Can you manage our Instagram content calendar?'],
  ['/social-media-strategy/', 'I need more social media followers'],
  ['/graphic-design/', 'Can you design our logo and brand identity?'],
  ['/graphic-design/', 'Do you make print-ready flyers?'],
  ['/digital-marketing/', 'Can you run paid ads and email campaigns?'],
  ['/digital-marketing/', 'I need more customers'],
  ['/free-audit/', 'Can you check what is wrong with my website for free?'],
  ['/free-audit/', 'Is my website slow on mobile?'],
  ['/lead-capture/', 'We keep missing enquiries'],
  ['/lead-capture/', 'Can leads be routed into our CRM?'],
  ['/ai-chatbot/', 'Can a chatbot qualify leads and book appointments?'],
  ['/ai-chatbot/', 'Tell me about your AI marketing system'],
  ['/live-visualizer/', 'Can customers preview flooring in their own room photo?'],
  ['/live-visualizer/', 'Can you build a live visualizer so shoppers see products before buying?'],
  ['/custom-calculators/', 'Can you build a material estimator with PDF quotes?'],
  ['/custom-calculators/', 'We need an instant pricing calculator'],
  ['/web-design-phoenix-az/', 'Do you work in Phoenix?'],
  ['/web-design-jacksonville-fl/', 'Do you cover Jacksonville Florida?'],
  ['/web-design-denver-co/', 'Can you build a website for a Denver business?'],
  ['/web-design-las-vegas-nv/', 'Do you serve Las Vegas?'],
  ['/web-design-charlotte-nc/', 'Do you work with Charlotte companies?'],
  ['/web-design-sarasota-fl/', 'Are you a web designer in Sarasota?'],
  ['/web-design-lakewood-ranch-fl/', 'Do you cover Lakewood Ranch?'],
  ['/web-design-bradenton-fl/', 'Can you help a Bradenton business with SEO?'],
  ['/web-design-venice-fl/', 'Do you offer web design in Venice Florida?'],
  ['/web-design-north-port-fl/', 'Do you work in North Port?'],
  ['/web-design-palmetto-fl/', 'Do you serve Palmetto Florida?'],
  ['/web-design-osprey-nokomis-fl/', 'Do you cover Osprey and Nokomis?'],
  ['/web-design-englewood-fl/', 'Can you do SEO in Englewood Florida?'],
  ['/web-design-tampa-fl/', 'Do you cover Tampa?'],
  ['/web-design-st-petersburg-fl/', 'Do you work in St Petersburg?'],
  ['/web-design-charleston-sc/', 'Do you serve Charleston South Carolina?'],
  ['/web-design-nashville-tn/', 'Do you cover Nashville?'],
  ['/web-design-raleigh-nc/', 'Do you work in Raleigh or Cary?'],
  ['/terms-of-use/', 'Where are your terms of use?'],
  ['/privacy-policy/', 'How do you handle personal data?'],
  ['/cookie-policy/', 'What is your cookie policy?'],
  ['/sms-policy/', 'What are your SMS terms?'],
  ['/website-making-or-costing-you-money/', 'Is my website making money or costing me money?'],
  ['/do-you-need-a-mobile-app/', 'What are four reasons I might need a mobile app?'],
  ['/why-ai-follow-up-beats-working-harder/', 'Why does AI follow-up beat working harder?'],
  ['/what-does-a-lead-actually-cost-you/', 'How can I work out what a lead costs?'],
  ['/build-a-calculator-that-sells-for-you/', 'Why should I build a calculator that sells for me?'],
  ['/seo-keeps-working-after-you-stop-paying/', 'Does SEO keep working after ads stop?'],
  ['/posting-is-not-a-social-media-strategy/', 'Why is my posting strategy not working?'],
  ['/let-them-see-it-before-they-buy-it/', 'Why let them see it before they buy it?'],
  ['/why-cheap-design-costs-more/', 'How can cheap design cost a business more?'],
]

const edgeCases = [
  ['help', 'help'],
  ['fallback', 'What is the weather in Sarasota?'],
  ['fallback', 'Who won the football game?'],
  ['fallback', 'Can you resell hosting to me?'],
  ['fallback', 'Do you place print advertising?'],
  ['fallback', 'Can I book a paid photography retainer?'],
  ['fallback', 'Do you offer payroll services?'],
  ['fallback', 'What is your refund policy for hosting?'],
  ['fallback', 'Do you work in mesa style architecture?'],
  ['fallback', 'Can you carry this project for me?'],
  ['fallback', 'I bought a Venice mask'],
  ['fallback', 'What species is a palmetto?'],
]

const easyCases = [
  ['/web-development/', 'website'],
  ['/mobile-app-development/', 'app'],
  ['/social-media-strategy/', 'social media'],
  ['/graphic-design/', 'logo'],
  ['/digital-marketing/', 'marketing'],
  ['/free-audit/', 'audit'],
  ['/lead-capture/', 'leads'],
  ['/ai-chatbot/', 'chatbot'],
  ['/live-visualizer/', 'visualizer'],
  ['/custom-calculators/', 'calculator'],
]

const languageCases = [
  'ok', 'si', 'no', 'per', 'que', 'hola', 'app', 'seo',
  'Hola, necesito una página web nueva',
  'Bonjour, combien coûte un site web ?',
  'Olá, preciso de SEO para a minha empresa',
  'Hallo, wie viel kostet eine Webseite?',
  'Ciao, avete un preventivo per un sito web?',
  'I need SEO for my café in São Paulo',
  'Hola, I need a new website for my negocio',
]

let failures = 0

for (const [expected, question] of [...routeCases, ...easyCases, ...edgeCases]) {
  const results = searchKnowledge(question, 4)
  const answer = answerQuestion(question)
  const links = answer.links?.map((link) => link.href) ?? []
  const routed = expected === 'fallback'
    ? answer.spoken === 'notFound'
    : expected === 'help'
      ? /What do you need help with/i.test(answer.text)
      : links.includes(expected)
  const noLongDash = !/[—–]/.test(JSON.stringify(answer))
  const passed = routed && noLongDash
  if (!passed) failures += 1
  console.log(JSON.stringify({
    passed,
    noLongDash,
    expected,
    question,
    language: answer.language,
    answer: answer.text,
    links,
    results: results.map(({ id, url, score }) => ({ id, url, score: Number(score.toFixed(2)) })),
  }))
}

console.log(JSON.stringify({ languageCases: languageCases.map((question) => ({
  question,
  detected: detectLanguage(question),
  translated: translateQuery(question),
})) }))

console.log(JSON.stringify({ total: routeCases.length + easyCases.length + edgeCases.length, failures }))
if (failures) process.exitCode = 1
