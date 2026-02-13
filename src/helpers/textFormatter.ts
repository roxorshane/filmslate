/**
 * Splits a block of text into paragraphs for rendering.
 *
 * If the text contains explicit paragraph breaks (\n\n), splits on those.
 * Otherwise, groups sentences into paragraphs of ~3 sentences each.
 */
function splitIntoParagraphs(text: string): string[] {
  if (text.includes('\n\n')) {
    return text.split('\n\n').map(p => p.trim()).filter(Boolean);
  }
  const sentencePattern = /[^.!?]+[.!?]+(\s|$)/g;
  const sentences: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = sentencePattern.exec(text)) !== null) {
    sentences.push(match[0].trim());
  }
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    paragraphs.push(sentences.slice(i, i + 3).join(' '));
  }
  return paragraphs.length > 0 ? paragraphs : [text];
}

export { splitIntoParagraphs };
export default splitIntoParagraphs;
