export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderNotificationHtml(input: {
  title: string;
  intro: string;
  paragraphs: string[];
  links?: Array<{ label: string; url: string | null }>;
}) {
  const links = input.links ?? [];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(input.title)}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #17202a; }
      h1 { margin-bottom: 12px; }
      p { line-height: 1.5; }
      ul { padding-left: 20px; }
      a { color: #0f5fff; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(input.title)}</h1>
    <p>${escapeHtml(input.intro)}</p>
    ${input.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
    ${
      links.length > 0
        ? `<ul>${links
            .map((link) => {
              if (!link.url) {
                return `<li>${escapeHtml(link.label)}</li>`;
              }

              return `<li><a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a></li>`;
            })
            .join('')}</ul>`
        : ''
    }
  </body>
</html>`;
}

export function renderNotificationText(input: {
  intro: string;
  paragraphs: string[];
  links?: Array<{ label: string; url: string | null }>;
}) {
  const lines = [input.intro, ...input.paragraphs];

  for (const link of input.links ?? []) {
    lines.push(link.url ? `${link.label}: ${link.url}` : link.label);
  }

  return lines.join('\n\n');
}