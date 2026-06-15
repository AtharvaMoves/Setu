/**
 * Convert Markdown or MDX source into a stable, AI-readable Markdown document.
 *
 * Core Markdown and fenced code blocks are preserved. Interface-only imports,
 * JSX wrappers, and quiz answer data are removed. Interactive playground source
 * is retained as a fenced code block when it can be extracted safely.
 */
export function stripMdxToText(rawMdx: string): string {
  let text = rawMdx;
  const codeBlocks: string[] = [];

  text = text.replace(/```[\s\S]*?```/g, (match) => {
    const index = codeBlocks.length;
    codeBlocks.push(match);
    return `%%SETU_CODE_BLOCK_${index}%%`;
  });

  text = text.replace(/<Quiz[\s\S]*?\]\}\s*\/>/g, "");
  text = text.replace(/^import\s+.*?Quiz.*?from\s+['"].*?['"];?\s*$/gm, "");

  text = text.replace(
    /<(?:CodePlayground|Playground)[^>]*?(?:code|initialHtml)=\{`([\s\S]*?)`\}[\s\S]*?\/>/g,
    (_, embeddedCode: string) =>
      `\n\`\`\`html\n${embeddedCode.trim()}\n\`\`\`\n`,
  );

  text = text.replace(/<(?:CodePlayground|Playground)[\s\S]*?\/>/g, "");
  text = text.replace(/^import\s[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, "");
  text = text.replace(/<[A-Z][a-zA-Z0-9]*[\s\S]*?\/>/g, "");
  text = text.replace(/<\/?[A-Z][a-zA-Z0-9]*[^>]*>/g, "");
  text = text.replace(/\]\}\s*\/>/g, "");

  text = text.replace(
    /%%SETU_CODE_BLOCK_(\d+)%%/g,
    (_, index: string) => codeBlocks[Number(index)],
  );
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}
