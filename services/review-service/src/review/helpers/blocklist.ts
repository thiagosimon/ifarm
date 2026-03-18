/**
 * Simple profanity blocklist for comment moderation.
 * Words here will cause a review to be flagged for manual moderation.
 * Extend this list as needed.
 */
const BLOCKLIST_WORDS: string[] = [
  'golpe',
  'fraude',
  'roubo',
  'ladrão',
  'ladrao',
  'pilantra',
  'safado',
  'safada',
  'vagabundo',
  'vagabunda',
  'idiota',
  'imbecil',
  'desgraçado',
  'desgracado',
  'filho da puta',
  'fdp',
  'porra',
  'caralho',
  'merda',
  'bosta',
  'cuzão',
  'cuzao',
  'arrombado',
  'arrombada',
  'otário',
  'otario',
  'babaca',
  'canalha',
  'estelionato',
  'caloteiro',
  'caloteira',
  'lixo',
  'nojento',
  'nojenta',
  'scam',
  'fraud',
  'thief',
  'steal',
];

/**
 * Check whether a comment contains any blocklisted words.
 * Returns true if any blocklist word is found (case-insensitive).
 */
export function containsBlocklistedWord(text: string): boolean {
  if (!text) return false;
  const normalized = text.toLowerCase().trim();
  return BLOCKLIST_WORDS.some((word) => normalized.includes(word));
}
