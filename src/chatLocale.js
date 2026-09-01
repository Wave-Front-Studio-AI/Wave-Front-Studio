// What the site assistant says, in the visitor's own language.
//
// The published pages are English, so the assistant never pretends to hold a
// translated copy of the site: it speaks the visitor's language and says
// plainly that the page it is pointing at is in English.

export const SUPPORTED_LANGUAGES = ['en', 'es', 'pt', 'fr', 'de', 'it']

export const UI = {
  en: {
    title: 'Wavefront assistant',
    status: 'Answers from this site · replies instantly',
    loading: 'Loading site knowledge…',
    tabChat: 'Ask a question',
    tabForm: 'Request help',
    placeholder: 'Ask anything, or say what you need built…',
    greeting:
      'Hi. Ask me anything about Wavefront Studio: what we build, what it costs, how long it takes, or whether we work in your area. Or tell me what you are trying to fix and I will point you at the right page.',
    notFound:
      'Sorry, I could not find that one. Try it in plain words — “I need a new website”, “how much is SEO”, “do you build apps”, “do you cover Tampa” — and I will find the page. Or I can pass you to the team.',
    handoff:
      'Fill in the short form and someone at Wavefront Studio will reply. Your chat so far goes with it, so you will not have to explain it twice.',
    leadIn: '',
    send: 'Send question',
    close: 'Close the assistant',
    open: 'Ask Wavefront',
    closeLabel: 'Close',
    formIntro:
      'Tell us what you need and someone at Wavefront Studio replies with a real answer. Your chat so far is included, so you do not have to repeat it.',
    name: 'Full name',
    company: 'Company',
    email: 'Email',
    phone: 'Phone',
    optional: 'Optional',
    topic: 'What do you need help with?',
    topicPlaceholder: 'Select a service',
    message: 'What are you trying to do?',
    messagePlaceholder: 'Describe the project, the deadline, and anything already in place.',
    submit: 'Send my request',
    sending: 'Sending…',
    done: 'Request received.',
    doneBody: 'Someone at Wavefront Studio will reply to the email address you gave us.',
    back: 'Back to the assistant',
    error: 'We could not send that. Email info@wavefrontstudiollc.com or call +1 (941) 415 2595.',
  },
  es: {
    title: 'Asistente de Wavefront',
    status: 'Respuestas de este sitio · al instante',
    loading: 'Cargando el contenido del sitio…',
    tabChat: 'Hacer una pregunta',
    tabForm: 'Pedir ayuda',
    placeholder: 'Pregunta lo que sea, o dime qué necesitas…',
    greeting:
      'Hola. Pregúntame lo que quieras sobre Wavefront Studio: qué construimos, cuánto cuesta, cuánto tarda o si trabajamos en tu zona. O dime qué quieres resolver y te indico la página correcta. Las páginas están publicadas en inglés.',
    notFound:
      'Perdona, eso no lo encuentro. Dímelo con palabras sencillas — «necesito una web nueva», «cuánto cuesta el SEO», «hacéis apps», «trabajáis en Tampa» — y te busco la página. O te paso con el equipo.',
    handoff:
      'Rellena el formulario corto y alguien de Wavefront Studio te responderá. Se envía tu conversación, así no tienes que explicarlo dos veces.',
    leadIn: 'Esto es lo que publica Wavefront Studio sobre eso. La página está en inglés:',
    send: 'Enviar pregunta',
    close: 'Cerrar el asistente',
    open: 'Pregunta a Wavefront',
    closeLabel: 'Cerrar',
    formIntro:
      'Cuéntanos qué necesitas y alguien de Wavefront Studio te responderá. Se incluye tu conversación para que no tengas que repetirla.',
    name: 'Nombre completo',
    company: 'Empresa',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    optional: 'Opcional',
    topic: '¿En qué necesitas ayuda?',
    topicPlaceholder: 'Elige un servicio',
    message: '¿Qué quieres conseguir?',
    messagePlaceholder: 'Describe el proyecto, la fecha límite y lo que ya tengas en marcha.',
    submit: 'Enviar mi solicitud',
    sending: 'Enviando…',
    done: 'Solicitud recibida.',
    doneBody: 'Alguien de Wavefront Studio responderá al correo que nos diste.',
    back: 'Volver al asistente',
    error: 'No se pudo enviar. Escribe a info@wavefrontstudiollc.com o llama al +1 (941) 415 2595.',
  },
  pt: {
    title: 'Assistente da Wavefront',
    status: 'Respostas deste site · na hora',
    loading: 'A carregar o conteúdo do site…',
    tabChat: 'Fazer uma pergunta',
    tabForm: 'Pedir ajuda',
    placeholder: 'Pergunte o que quiser, ou diga o que precisa…',
    greeting:
      'Olá. Pergunte-me o que quiser sobre a Wavefront Studio: o que construímos, quanto custa, quanto demora, ou se trabalhamos na sua zona. Ou diga-me o que quer resolver e eu aponto a página certa. As páginas estão publicadas em inglês.',
    notFound:
      'Desculpe, isso não encontrei. Diga por palavras simples — «preciso de um site novo», «quanto custa o SEO», «fazem apps», «trabalham em Tampa» — e eu procuro a página. Ou passo o seu caso à equipa.',
    handoff:
      'Preencha o formulário curto e alguém da Wavefront Studio responde. A sua conversa vai junto, para não ter de explicar duas vezes.',
    leadIn: 'É isto que a Wavefront Studio publica sobre o assunto. A página está em inglês:',
    send: 'Enviar pergunta',
    close: 'Fechar o assistente',
    open: 'Pergunte à Wavefront',
    closeLabel: 'Fechar',
    formIntro:
      'Diga-nos do que precisa e alguém da Wavefront Studio responderá. A sua conversa vai incluída para não ter de repetir.',
    name: 'Nome completo',
    company: 'Empresa',
    email: 'E-mail',
    phone: 'Telefone',
    optional: 'Opcional',
    topic: 'Em que precisa de ajuda?',
    topicPlaceholder: 'Escolha um serviço',
    message: 'O que quer alcançar?',
    messagePlaceholder: 'Descreva o projeto, o prazo e o que já existe.',
    submit: 'Enviar o meu pedido',
    sending: 'A enviar…',
    done: 'Pedido recebido.',
    doneBody: 'Alguém da Wavefront Studio responderá ao e-mail que nos deu.',
    back: 'Voltar ao assistente',
    error: 'Não foi possível enviar. Escreva para info@wavefrontstudiollc.com ou ligue +1 (941) 415 2595.',
  },
  fr: {
    title: 'Assistant Wavefront',
    status: 'Réponses tirées de ce site · immédiates',
    loading: 'Chargement du contenu du site…',
    tabChat: 'Poser une question',
    tabForm: 'Demander de l’aide',
    placeholder: 'Posez votre question, ou dites ce qu’il vous faut…',
    greeting:
      'Bonjour. Posez-moi n’importe quelle question sur Wavefront Studio : ce que nous construisons, le prix, les délais, ou si nous intervenons dans votre région. Ou dites-moi ce que vous cherchez à régler et je vous indique la bonne page. Les pages sont publiées en anglais.',
    notFound:
      'Désolé, je ne trouve pas. Dites-le simplement — « il me faut un nouveau site », « combien coûte le SEO », « faites-vous des applis », « couvrez-vous Tampa » — et je trouverai la page. Ou je vous mets en relation avec l’équipe.',
    handoff:
      'Remplissez le court formulaire et quelqu’un de Wavefront Studio vous répondra. Votre conversation est jointe, vous n’aurez pas à répéter.',
    leadIn: 'Voici ce que Wavefront Studio publie à ce sujet. La page est en anglais :',
    send: 'Envoyer la question',
    close: 'Fermer l’assistant',
    open: 'Demandez à Wavefront',
    closeLabel: 'Fermer',
    formIntro:
      'Dites-nous ce qu’il vous faut et quelqu’un de Wavefront Studio vous répondra. Votre conversation est jointe, rien à répéter.',
    name: 'Nom complet',
    company: 'Société',
    email: 'E-mail',
    phone: 'Téléphone',
    optional: 'Facultatif',
    topic: 'Sur quoi avez-vous besoin d’aide ?',
    topicPlaceholder: 'Choisissez un service',
    message: 'Que cherchez-vous à faire ?',
    messagePlaceholder: 'Décrivez le projet, l’échéance et ce qui existe déjà.',
    submit: 'Envoyer ma demande',
    sending: 'Envoi…',
    done: 'Demande reçue.',
    doneBody: 'Quelqu’un de Wavefront Studio répondra à l’adresse que vous avez indiquée.',
    back: 'Revenir à l’assistant',
    error: 'L’envoi a échoué. Écrivez à info@wavefrontstudiollc.com ou appelez le +1 (941) 415 2595.',
  },
  de: {
    title: 'Wavefront-Assistent',
    status: 'Antworten aus dieser Website · sofort',
    loading: 'Website-Inhalte werden geladen…',
    tabChat: 'Frage stellen',
    tabForm: 'Hilfe anfordern',
    placeholder: 'Fragen Sie einfach, oder sagen Sie, was Sie brauchen…',
    greeting:
      'Hallo. Fragen Sie mich alles über Wavefront Studio: was wir bauen, was es kostet, wie lange es dauert, oder ob wir in Ihrer Region arbeiten. Oder sagen Sie mir, was Sie lösen wollen, und ich zeige Ihnen die passende Seite. Die Seiten sind auf Englisch veröffentlicht.',
    notFound:
      'Das finde ich leider nicht. Sagen Sie es mit einfachen Worten — „ich brauche eine neue Website“, „was kostet SEO“, „bauen Sie Apps“, „arbeiten Sie in Tampa“ — dann finde ich die Seite. Oder ich leite Sie an das Team weiter.',
    handoff:
      'Füllen Sie das kurze Formular aus, dann antwortet jemand von Wavefront Studio. Ihr bisheriger Chat geht mit, Sie müssen nichts wiederholen.',
    leadIn: 'Das veröffentlicht Wavefront Studio dazu. Die Seite ist auf Englisch:',
    send: 'Frage senden',
    close: 'Assistent schließen',
    open: 'Wavefront fragen',
    closeLabel: 'Schließen',
    formIntro:
      'Sagen Sie uns, was Sie brauchen. Jemand von Wavefront Studio antwortet. Ihr bisheriger Chat wird mitgeschickt.',
    name: 'Vollständiger Name',
    company: 'Unternehmen',
    email: 'E-Mail',
    phone: 'Telefon',
    optional: 'Optional',
    topic: 'Wobei brauchen Sie Hilfe?',
    topicPlaceholder: 'Leistung wählen',
    message: 'Was möchten Sie erreichen?',
    messagePlaceholder: 'Beschreiben Sie das Projekt, den Termin und was bereits vorhanden ist.',
    submit: 'Anfrage senden',
    sending: 'Wird gesendet…',
    done: 'Anfrage erhalten.',
    doneBody: 'Jemand von Wavefront Studio antwortet an die angegebene E-Mail-Adresse.',
    back: 'Zurück zum Assistenten',
    error: 'Senden nicht möglich. Bitte an info@wavefrontstudiollc.com schreiben oder +1 (941) 415 2595 anrufen.',
  },
  it: {
    title: 'Assistente Wavefront',
    status: 'Risposte da questo sito · immediate',
    loading: 'Caricamento dei contenuti del sito…',
    tabChat: 'Fai una domanda',
    tabForm: 'Chiedi aiuto',
    placeholder: 'Chiedi pure, o dimmi cosa ti serve…',
    greeting:
      'Ciao. Chiedimi quello che vuoi su Wavefront Studio: cosa costruiamo, quanto costa, quanto tempo serve, o se lavoriamo nella tua zona. Oppure dimmi cosa vuoi risolvere e ti indico la pagina giusta. Le pagine sono pubblicate in inglese.',
    notFound:
      'Mi dispiace, questo non lo trovo. Dimmelo con parole semplici — «mi serve un sito nuovo», «quanto costa la SEO», «fate app», «lavorate a Tampa» — e ti trovo la pagina. Oppure ti passo al team.',
    handoff:
      'Compila il modulo breve e qualcuno di Wavefront Studio ti risponderà. La conversazione viene allegata, così non devi ripetere.',
    leadIn: 'Ecco cosa pubblica Wavefront Studio in merito. La pagina è in inglese:',
    send: 'Invia domanda',
    close: 'Chiudi l’assistente',
    open: 'Chiedi a Wavefront',
    closeLabel: 'Chiudi',
    formIntro:
      'Dicci cosa ti serve e qualcuno di Wavefront Studio ti risponderà. La conversazione viene allegata, così non devi ripeterla.',
    name: 'Nome completo',
    company: 'Azienda',
    email: 'Email',
    phone: 'Telefono',
    optional: 'Facoltativo',
    topic: 'Di cosa hai bisogno?',
    topicPlaceholder: 'Scegli un servizio',
    message: 'Cosa vuoi ottenere?',
    messagePlaceholder: 'Descrivi il progetto, la scadenza e cosa esiste già.',
    submit: 'Invia la richiesta',
    sending: 'Invio…',
    done: 'Richiesta ricevuta.',
    doneBody: 'Qualcuno di Wavefront Studio risponderà all’indirizzo email che hai indicato.',
    back: 'Torna all’assistente',
    error: 'Invio non riuscito. Scrivi a info@wavefrontstudiollc.com o chiama +1 (941) 415 2595.',
  },
}

export const CHIPS = {
  en: ['What do you build?', 'How much does it cost?', 'Do you work in my area?', 'Talk to a person'],
  es: ['¿Qué construyen?', '¿Cuánto cuesta?', '¿Trabajan en mi zona?', 'Hablar con una persona'],
  pt: ['O que constroem?', 'Quanto custa?', 'Trabalham na minha zona?', 'Falar com uma pessoa'],
  fr: ['Que construisez-vous ?', 'Combien ça coûte ?', 'Intervenez-vous chez moi ?', 'Parler à une personne'],
  de: ['Was bauen Sie?', 'Was kostet das?', 'Arbeiten Sie in meiner Region?', 'Mit einer Person sprechen'],
  it: ['Cosa costruite?', 'Quanto costa?', 'Lavorate nella mia zona?', 'Parlare con una persona'],
}

// Phrases that must always open the request form, whatever the language.
export const HANDOFF_PHRASES = [
  'talk to a person', 'request help', 'speak to someone',
  'hablar con una persona', 'pedir ayuda',
  'falar com uma pessoa', 'pedir ajuda',
  'parler à une personne', 'demander de l’aide',
  'mit einer person sprechen', 'hilfe anfordern',
  'parlare con una persona', 'chiedi aiuto',
]

export function strings(language) {
  return UI[language] ?? UI.en
}
