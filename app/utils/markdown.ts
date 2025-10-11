import showdown from 'showdown';

const converter = new showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  emoji: true,
});

export async function transformMarkdownToHtml(markdown: string | null | undefined): Promise<string> {
  if (!markdown) return '';
  try {
    return converter.makeHtml(markdown);
  } catch (error) {
    console.error('Error transforming markdown:', error);
    return '';
  }
}
