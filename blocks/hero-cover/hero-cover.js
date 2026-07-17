export default function decorate(block) {
  const rows = [...block.children];

  // First row holds the background image, second row holds the text content.
  const imageRow = rows.find((row) => row.querySelector('picture'));
  const contentRow = rows.find((row) => row !== imageRow);

  if (imageRow) imageRow.classList.add('hero-cover-image');
  if (contentRow) contentRow.classList.add('hero-cover-content');

  if (!imageRow) {
    block.classList.add('no-image');
  }

  // Interior "banner" variant: a short full-width hero with just a title
  // (no paragraphs, no CTA), title anchored bottom-left. The homepage hero,
  // by contrast, has body copy and a CTA in a tall left-aligned green panel.
  const hasParagraphs = contentRow?.querySelector('p');
  if (contentRow && !hasParagraphs) {
    block.classList.add('hero-cover-banner');
  }

  // Style a standalone CTA link as a button (EDS may not auto-decorate it).
  const cta = contentRow?.querySelector('p > a:only-child');
  if (cta && !cta.classList.contains('button')) {
    cta.classList.add('button');
    cta.closest('p').classList.add('button-container');
  }
}
