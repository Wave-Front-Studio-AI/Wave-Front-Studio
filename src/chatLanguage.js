// Language detection and query translation for the site assistant.
//
// Loaded with the knowledge index rather than the widget: none of it is needed
// until a visitor actually asks something.

// Function words are the cheapest reliable signal: they appear in almost every
// sentence and rarely collide across these six languages. Words that are also
// ordinary English are deliberately left out.
const LANGUAGE_MARKERS = {
  es: ['que', 'para', 'con', 'los', 'las', 'una', 'como', 'cuanto', 'cuesta', 'tienen', 'tiene', 'tengo', 'tenemos', 'quiero', 'queremos', 'necesito', 'necesitamos', 'puedo', 'pueden', 'podemos', 'trabajan', 'trabajamos', 'servicios', 'precio', 'precios', 'ayuda', 'ayudar', 'empresa', 'negocio', 'por', 'del', 'soy', 'somos', 'estoy', 'estamos', 'hacen', 'sobre', 'nuestra', 'nuestro', 'mis', 'muy', 'tambien', 'también', 'donde', 'dónde', 'quien', 'quién', 'hay', 'porque', 'esto', 'esta', 'pagina', 'página', 'sitio', 'tienda', 'busco', 'ustedes', 'nadie', 'encuentran', 'encuentra', 'rediseño', 'rediseno'],
  pt: ['para', 'com', 'uma', 'como', 'quanto', 'custa', 'tenho', 'temos', 'quero', 'queremos', 'preciso', 'precisamos', 'posso', 'podem', 'podemos', 'trabalham', 'trabalhamos', 'serviços', 'servicos', 'preço', 'preco', 'ajuda', 'ajudar', 'empresa', 'negócio', 'negocio', 'meu', 'minha', 'sou', 'somos', 'estou', 'estamos', 'fazem', 'nossa', 'nosso', 'muito', 'também', 'tambem', 'onde', 'quem', 'não', 'nao', 'demora', 'pronto', 'ficar', 'está', 'esta', 'página', 'pagina', 'loja', 'site'],
  fr: ['pour', 'avec', 'les', 'des', 'une', 'comment', 'combien', 'coute', 'coûte', 'vous', 'nous', 'notre', 'votre', 'puis', 'pouvez', 'pouvons', 'travaillez', 'travaillons', 'prix', 'aide', 'aider', 'entreprise', 'mon', 'suis', 'sommes', 'faites', 'gere', 'gère', 'avez', 'avons', 'quel', 'quelle', 'où', 'aussi', 'très', 'tres', 'mes', 'ce', 'refonte', 'boutique', 'délai', 'delai'],
  de: ['und', 'der', 'die', 'das', 'für', 'fur', 'mit', 'wie', 'viel', 'kostet', 'haben', 'habe', 'ich', 'wir', 'unsere', 'unser', 'kann', 'können', 'konnen', 'arbeiten', 'dienstleistungen', 'preis', 'preise', 'hilfe', 'unternehmen', 'mein', 'meine', 'sind', 'machen', 'nicht', 'auch', 'sehr', 'wo', 'brauche', 'brauchen', 'ist', 'seite', 'webseite', 'suchmaschine', 'dauert'],
  it: ['che', 'per', 'con', 'una', 'come', 'quanto', 'costa', 'gli', 'nel', 'della', 'delle', 'avete', 'abbiamo', 'voglio', 'vogliamo', 'posso', 'potete', 'possiamo', 'lavorate', 'lavoriamo', 'servizi', 'prezzo', 'prezzi', 'aiuto', 'aiutare', 'azienda', 'mio', 'mia', 'sono', 'siamo', 'fate', 'nostra', 'nostro', 'anche', 'molto', 'dove', 'non', 'troppo', 'pagina', 'negozio', 'preventivo'],
}

// Words that belong to exactly one of the six, used to settle short sentences
// and to break ties between languages that share function words.
const DECISIVE_MARKERS = {
  es: ['hola', 'cuánto', 'cuesta', 'quiero', 'necesito', 'ustedes', 'trabajan', 'precios', 'español', 'hacen', 'tenéis', 'tengo', 'buenos', 'gracias', 'negocio', 'encuentran', 'nadie', 'diseño'],
  pt: ['olá', 'ola', 'obrigado', 'obrigada', 'você', 'voce', 'trabalham', 'preço', 'português', 'fazem', 'tenho', 'preciso', 'bom dia'],
  fr: ['bonjour', 'salut', 'combien', 'coûte', 'pouvez', 'entreprise', 'français', 'travaillez', 'merci', 'gère', 'nous avons', 'refonte'],
  de: ['hallo', 'kostet', 'können', 'unternehmen', 'dienstleistungen', 'arbeiten', 'deutsch', 'danke', 'brauche', 'guten', 'webseite', 'ist das'],
  it: ['ciao', 'avete', 'potete', 'azienda', 'italiano', 'lavorate', 'servizi', 'grazie', 'abbiamo', 'preventivo', 'sito web'],
}

// Letters that never appear in ordinary English, scored per language that uses
// them so a short accented phrase is not mistaken for English.
const DIACRITICS = {
  es: /[ñáíóúü¿¡]/i,
  pt: /[ãõçáâêóôú]/i,
  fr: /[àâçéèêëîïôùûœ]/i,
  de: /[äöüß]/i,
  it: /[àèéìòù]/i,
}

const FOREIGN_FUNCTION_WORDS = ['de', 'da', 'do', 'das', 'dos', 'el', 'la', 'lo', 'al', 'du', 'le', 'un', 'um', 'uma', 'uno', 'ein', 'eine', 'einen', 'il', 'em', 'no', 'na', 'ao', 'aux', 'ist', 'sie', 'est', 'sur', 'dans', 'para', 'como', 'sono', 'siamo', 'os', 'as', 'porque', 'por', 'esto', 'esta', 'este', 'mis', 'tus', 'sus', 'hay', 'va', 'mi', 'dem', 'den', 'dei', 'todo', 'toda', 'cosa', 'chi', 'ci', 'ne', 'pas', 'plus', 'ni', 'se', 'si', 'ma', 'aber', 'kein', 'keine', 'nein', 'doch', 'sehr', 'gut', 'bien', 'bem']

export const FOREIGN_STOP_WORDS = new Set(
  [...Object.values(LANGUAGE_MARKERS).flat(), ...Object.values(DECISIVE_MARKERS).flat(), ...FOREIGN_FUNCTION_WORDS]
    .flatMap((word) => {
      const folded = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const stemmed = folded.length > 4 && folded.endsWith('s') && !folded.endsWith('ss') ? folded.slice(0, -1) : folded
      return [folded, stemmed]
    }),
)

export function detectLanguage(text) {
  const lowered = ` ${String(text ?? '').toLowerCase()} `
  const words = lowered.split(/[^a-zà-ÿ]+/).filter(Boolean)
  if (words.length === 0) return 'en'

  const scores = {}
  for (const language of Object.keys(LANGUAGE_MARKERS)) {
    let score = words.filter((word) => LANGUAGE_MARKERS[language].includes(word)).length
    for (const marker of DECISIVE_MARKERS[language]) {
      if (lowered.includes(` ${marker} `) || lowered.includes(` ${marker},`) || lowered.includes(` ${marker}?`)) score += 2.5
    }
    if (DIACRITICS[language].test(lowered)) score += 0.5
    scores[language] = score
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const [best, bestScore] = ranked[0]
  // One shared word like "que" or "per" is not enough to leave English.
  return bestScore >= 1.5 ? best : 'en'
}

// Visitor vocabulary in each language, mapped to the English words the index
// already holds. Only terms that lead somewhere on this site are listed — a
// word with no matching page would just add noise to the search.
const TERMS = {
  // what the site builds
  sitio: 'website', pagina: 'website page', página: 'website page', webseite: 'website',
  sitios: 'website', paginas: 'website', páginas: 'website', seiten: 'website',
  sito: 'website', siti: 'website',
  tienda: 'ecommerce store', loja: 'ecommerce store', boutique: 'ecommerce store',
  negozio: 'ecommerce store', laden: 'ecommerce store', comercio: 'ecommerce',
  desarrollo: 'development', desenvolvimento: 'development', developpement: 'development',
  développement: 'development', entwicklung: 'development', sviluppo: 'development',
  diseno: 'design', diseño: 'design', desenho: 'design', conception: 'design',
  gestaltung: 'design', progettazione: 'design', grafico: 'graphic design',
  gráfico: 'graphic design', graphique: 'graphic design', grafik: 'graphic design',
  logotipo: 'logo branding', marca: 'brand branding', marque: 'brand branding',
  markenbildung: 'branding', identidad: 'brand identity', identidade: 'brand identity',
  identite: 'brand identity', identité: 'brand identity', identita: 'brand identity',
  aplicacion: 'app mobile', aplicación: 'app mobile', aplicativo: 'app mobile',
  aplicacao: 'app mobile', aplicação: 'app mobile', application: 'app mobile',
  anwendung: 'app mobile', applicazione: 'app mobile', movil: 'mobile', móvil: 'mobile',
  telemovel: 'mobile', telemóvel: 'mobile', handy: 'mobile', cellulare: 'mobile',
  rediseno: 'redesign website', rediseño: 'redesign website', refonte: 'redesign website',
  neugestaltung: 'redesign website', rifacimento: 'redesign website',
  reconstruir: 'rebuild website', reconstruction: 'rebuild website',
  // search, marketing and social
  buscador: 'search engine seo', buscadores: 'search engine seo',
  suchmaschine: 'search engine seo', motore: 'search engine seo',
  posicionamiento: 'seo ranking', posicionamento: 'seo ranking',
  referencement: 'seo ranking', référencement: 'seo ranking',
  clasificacion: 'ranking', clasificación: 'ranking', classement: 'ranking',
  ranghi: 'ranking', busqueda: 'search', búsqueda: 'search', busca: 'search',
  recherche: 'search', suche: 'search', ricerca: 'search',
  marketing: 'marketing', mercadotecnia: 'marketing', publicidad: 'marketing advertising',
  publicidade: 'marketing advertising', publicite: 'marketing advertising',
  publicité: 'marketing advertising', werbung: 'marketing advertising',
  pubblicita: 'marketing advertising', pubblicità: 'marketing advertising',
  anuncios: 'ads advertising', anuncio: 'ads advertising', annonces: 'ads advertising',
  anzeigen: 'ads advertising', annunci: 'ads advertising',
  redes: 'social media', sociais: 'social media', sociaux: 'social media',
  sozialen: 'social media', sociali: 'social media', seguidores: 'followers audience',
  contenido: 'content', conteudo: 'content', conteúdo: 'content', contenu: 'content',
  inhalt: 'content', contenuto: 'content', correo: 'email', courriel: 'email',
  boletin: 'newsletter email', boletín: 'newsletter email',
  // custom works
  chatbot: 'chatbot', asistente: 'chatbot assistant', assistente: 'chatbot assistant',
  assistent: 'chatbot assistant', robot: 'chatbot', automatizacion: 'automation',
  automatización: 'automation', automacao: 'automation', automação: 'automation',
  automatisation: 'automation', automatisierung: 'automation', automazione: 'automation',
  visualizador: 'visualizer preview', visualiseur: 'visualizer preview',
  visualisierer: 'visualizer preview', visualizzatore: 'visualizer preview',
  calculadora: 'calculator', calculatrice: 'calculator', rechner: 'calculator',
  calcolatrice: 'calculator', calculadoras: 'calculator', cotizador: 'quote calculator',
  presupuesto: 'quote estimate', orcamento: 'quote estimate', orçamento: 'quote estimate',
  devis: 'quote estimate', angebot: 'quote estimate', preventivo: 'quote estimate',
  cotizacion: 'quote estimate', cotización: 'quote estimate',
  kostenvoranschlag: 'quote estimate',
  // money and process
  precio: 'pricing price', precios: 'pricing price', preco: 'pricing price',
  preço: 'pricing price', prix: 'pricing price', preis: 'pricing price',
  preise: 'pricing price', prezzo: 'pricing price', prezzi: 'pricing price',
  tarifas: 'pricing price', tarifs: 'pricing price',
  cuesta: 'cost', custa: 'cost', coute: 'cost', coûte: 'cost', kostet: 'cost',
  costa: 'cost', costo: 'cost', coste: 'cost', gratis: 'free', gratuito: 'free',
  gratuit: 'free', kostenlos: 'free', auditoria: 'audit', auditoría: 'audit',
  paquete: 'package bundle', pacote: 'package bundle', forfait: 'package bundle',
  paket: 'package bundle', pacchetto: 'package bundle', descuento: 'discount',
  desconto: 'discount', remise: 'discount', rabatt: 'discount', sconto: 'discount',
  demora: 'how long timeline', tarda: 'how long timeline', dauert: 'how long timeline',
  demorar: 'how long timeline', plazo: 'timeline', prazo: 'timeline',
  delai: 'timeline', délai: 'timeline', tempi: 'timeline',
  tiempo: 'time', tempo: 'time', temps: 'time', zeit: 'time',
  mantenimiento: 'maintenance support', manutencao: 'maintenance support',
  manutenção: 'maintenance support', maintenance: 'maintenance support',
  wartung: 'maintenance support', manutenzione: 'maintenance support',
  soporte: 'support', suporte: 'support', unterstutzung: 'support',
  unterstützung: 'support', supporto: 'support',
  // people, place and leads
  clientes: 'customers clients', clienti: 'customers clients',
  kunden: 'customers clients', ventas: 'sales', vendas: 'sales', ventes: 'sales',
  vertrieb: 'sales', vendite: 'sales', llamadas: 'calls phone',
  chamadas: 'calls phone', appels: 'calls phone', anrufe: 'calls phone',
  chiamate: 'calls phone', seguimiento: 'follow up', acompanhamento: 'follow up',
  suivi: 'follow up', nachfassen: 'follow up', consultas: 'enquiries leads',
  consulta: 'enquiries leads', anfragen: 'enquiries leads',
  richieste: 'enquiries leads', demandes: 'enquiries leads',
  telefono: 'phone', teléfono: 'phone', telefone: 'phone', telefon: 'phone',
  contacto: 'contact', contato: 'contact', kontakt: 'contact', contatto: 'contact',
  direccion: 'address location', dirección: 'address location',
  endereco: 'address location', endereço: 'address location',
  adresse: 'address location', indirizzo: 'address location',
  ubicacion: 'location area', ubicación: 'location area',
  localizacao: 'location area', localização: 'location area',
  standort: 'location area', zona: 'area location', region: 'area location',
  región: 'area location', região: 'area location', ciudad: 'city area',
  cidade: 'city area', ville: 'city area', stadt: 'city area', citta: 'city area',
  città: 'city area', cerca: 'near local', perto: 'near local', pres: 'near local',
  près: 'near local', vicino: 'near local', nahe: 'near local',
  persona: 'person', pessoa: 'person', personne: 'person', mensch: 'person',
  humano: 'human', humain: 'human', equipo: 'team', equipe: 'team', équipe: 'team',
  squadra: 'team', empresa: 'business company', negocio: 'business company',
  entreprise: 'business company', unternehmen: 'business company',
  azienda: 'business company', portafolio: 'portfolio work',
  portefolio: 'portfolio work', portefeuille: 'portfolio work',
  proyectos: 'projects work', projetos: 'projects work', projets: 'projects work',
  projekte: 'projects work', progetti: 'projects work',
  servicios: 'services', servicos: 'services', serviços: 'services',
  dienstleistungen: 'services', servizi: 'services',
  blog: 'blog articles', articulos: 'blog articles', artículos: 'blog articles',
  artigos: 'blog articles', articles: 'blog articles', artikel: 'blog articles',
  articoli: 'blog articles',
}

// Terms whose stem overlaps an unrelated English word, so only an exact match
// is allowed to trigger them.
const EXACT_ONLY = new Set([
  'persona', 'pessoa', 'personne', 'mensch', 'humano', 'humain',
  'marca', 'zona', 'region', 'cerca', 'laden', 'blog', 'marketing', 'chatbot',
  'robot', 'maintenance', 'application', 'articles', 'costa', 'costo', 'tempo', 'temps',
])

function fold(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const FOLDED_TERMS = new Map()
for (const [term, english] of Object.entries(TERMS)) {
  const key = fold(term)
  if (!FOLDED_TERMS.has(key)) FOLDED_TERMS.set(key, { english, stemmable: !EXACT_ONLY.has(term) && key.length >= 5 })
}
const FOLDED_KEYS = [...FOLDED_TERMS.keys()]

function sharedPrefix(a, b) {
  const limit = Math.min(a.length, b.length)
  let index = 0
  while (index < limit && a[index] === b[index]) index += 1
  return index
}

// Visitors inflect: "aplicaciones", "calculadoras", "Webseiten". Accents are
// folded and a shared stem is accepted so a plural still finds its page.
function lookupTerm(word) {
  const folded = fold(word)
  if (!folded) return null

  const exact = FOLDED_TERMS.get(folded)
  if (exact) return exact.english

  if (folded.length < 5 || FOREIGN_STOP_WORDS.has(folded)) return null
  for (const key of FOLDED_KEYS) {
    const candidate = FOLDED_TERMS.get(key)
    if (!candidate.stemmable) continue
    const shared = sharedPrefix(folded, key)
    if (shared >= 5 && shared >= Math.max(folded.length, key.length) * 0.7) return candidate.english
  }
  return null
}

// Rewrites a question into the English terms the index holds, leaving anything
// already English untouched.
export function translateQuery(text, language = detectLanguage(text)) {
  const value = String(text ?? '')
  // The dictionary contains real foreign words that can also be English words
  // or brand names. Never rewrite an input unless detection (or conversation
  // context supplied by the caller) says it is one of the translated languages.
  if (language === 'en') return value
  return value
    .split(/(\s+)/)
    .map((part) => {
      const bare = part.toLowerCase().replace(/[^a-zà-ÿ]/g, '')
      const mapped = lookupTerm(bare)
      return mapped ? part.toLowerCase().replace(bare, mapped) : part
    })
    .join('')
}
