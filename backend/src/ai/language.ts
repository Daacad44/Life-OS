import { prisma } from '../config/db.js'
import { logger } from '../config/logger.js'

export type Language = 'en' | 'so'

// The response-language contract injected into every Gemini call (see service.ts). It is
// deliberately forceful: the stored preference — not the language the user happens to
// type in — governs the reply, unless the user explicitly asks otherwise in-message.
const DIRECTIVES: Record<Language, string> = {
  en: [
    'LANGUAGE: Respond ONLY in English.',
    "Use clear, natural English. Always reply in English regardless of the language the user's message is written in (even if they write in Somali or mix languages), unless the user explicitly asks you to reply in another language in their message.",
    'If a response contains JSON, keep all JSON keys and enum values in English; only human-readable text values may be localized.',
  ].join(' '),
  so: [
    'LANGUAGE: Respond ONLY in Somali (Af-Soomaali).',
    'Isticmaal Af-Soomaali dabiici ah oo cad. Had iyo jeer ku jawaab Af-Soomaali iyadoo aan loo eegin luqadda farriinta uu qoray isticmaaluhu (xitaa hadduu Ingiriisi ku qoro ama luqado isku daro), ilaa uu isticmaaluhu si cad ugu codsado luqad kale farriintiisa.',
    'Ka fogow tarjumaad sax-ahaaneed (literal) oo qallafsan — isticmaal hadal Soomaali oo dabiici ah. Ereyada muhiimka ah ee alaabta/summada barnaamijka ku dhaaf si la fahmi karo.',
    'Haddii jawaabtu ay JSON ku jirto, furayaasha (keys) iyo qiimayaasha enum-ka ku dhaaf Ingiriisi; kaliya qoraalka dadku akhriyo ayaa Af-Soomaali noqon kara.',
  ].join(' '),
}

function isLanguage(v: unknown): v is Language {
  return v === 'en' || v === 'so'
}

// Loads the user's saved AI language. Defaults to English on any miss/error — AI is a
// layer, never a hard dependency, so a lookup failure must not break the feature.
export async function getUserLanguage(userId: string): Promise<Language> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { language: true },
    })
    return isLanguage(user?.language) ? user.language : 'en'
  } catch (err) {
    logger.error({ err }, 'Failed to load user language, defaulting to English')
    return 'en'
  }
}

// Appends the language contract to a feature's system prompt. Kept last so it has the
// final say over anything the feature prompt implied about language.
export function withLanguageDirective(system: string, language: Language): string {
  return `${system}\n\n${DIRECTIVES[language]}`
}
