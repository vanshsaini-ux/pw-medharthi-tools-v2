/** Strips control characters, HTML tags and excess whitespace so freeform
 * fields (name, city, resume text, background one-liners) can never
 * inject markup into the Google Sheet or into any HTML we render. */
export function sanitizeText(input: string, maxLength = 2000): string {
  if (!input) return '';
  const noTags = input.replace(/<[^>]*>/g, ' ');
  const noControlChars = noTags.replace(/[\u0000-\u001F\u007F]/g, ' ');
  const collapsedWhitespace = noControlChars.replace(/\s+/g, ' ').trim();
  return collapsedWhitespace.slice(0, maxLength);
}

export function sanitizeEmail(input: string): string {
  return sanitizeText(input, 200).toLowerCase();
}

export function sanitizePhone(input: string): string {
  return input.replace(/[^0-9+]/g, '').slice(0, 20);
}
