const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}

/**
 * Formatage inline minimal du contenu du guide : `**gras**`, `*italique*` et
 * `` `code` ``.
 *
 * Le HTML est échappé AVANT toute substitution, donc le résultat ne peut
 * contenir que les balises produites ici — v-html est sûr même si un texte
 * contient des chevrons.
 */
export function formatInline(text: string): string {
  return text
    .replace(/[&<>"]/g, char => HTML_ESCAPES[char]!)
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1 py-0.5 rounded bg-elevated text-[0.9em] font-mono">$1</code>',
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-highlighted">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}
