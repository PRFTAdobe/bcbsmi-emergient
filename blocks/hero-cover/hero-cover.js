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

  // Style a standalone CTA link as a button (EDS may not auto-decorate it).
  const cta = contentRow?.querySelector('p > a:only-child');
  if (cta && !cta.classList.contains('button')) {
    cta.classList.add('button');
    cta.closest('p').classList.add('button-container');
  }
}
