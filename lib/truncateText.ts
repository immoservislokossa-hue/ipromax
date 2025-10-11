/**
 * Coupe un texte trop long et ajoute "…" à la fin si nécessaire.
 * @param text - Le texte à tronquer
 * @param maxLength - La longueur maximale autorisée (par défaut : 100)
 * @returns Texte tronqué proprement
 */
export default function truncateText(text: string, maxLength: number = 100): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
