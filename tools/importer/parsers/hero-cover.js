/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cover. Base block: hero.
 * Source: https://emergient.com/ (WordPress wp-block-cover)
 * Generated: 2026-07-17
 *
 * Structure (from library-description.txt): 1 column, 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: background image (optional)
 *   Row 3: title (heading) + subheading (paragraphs) + CTA (text with link)
 *
 * Source notes: the source has NESTED wp-block-cover elements. The OUTER cover
 * carries the real background image (img.wp-block-cover__image-background); the
 * text/CTA live inside the INNERMOST wp-block-cover__inner-container.
 */
export default function parse(element, { document }) {
  // Background image: the outer cover's own image-background (not any nested one).
  // Prefer a direct/first background image so we grab the outer cover's asset.
  const bgImage = element.querySelector(
    'img.wp-block-cover__image-background, img[class*="image-background"]',
  );

  // Text content lives in the innermost inner-container. Grab the last one so we
  // resolve to the deepest (innermost) container when covers are nested.
  const innerContainers = element.querySelectorAll('.wp-block-cover__inner-container');
  const contentRoot = innerContainers.length
    ? innerContainers[innerContainers.length - 1]
    : element;

  // Heading (WordPress emits h2; allow h1/h3 for variation).
  const heading = contentRoot.querySelector('h1, h2, h3, .wp-block-heading');

  // Subheading paragraphs.
  const paragraphs = Array.from(contentRoot.querySelectorAll('p'));

  // CTA button link.
  const ctaLinks = Array.from(
    contentRoot.querySelectorAll('a.wp-block-button__link, .wp-block-button a, a.wp-element-button'),
  );

  // Empty-block guard: bail if there is no meaningful content.
  if (!heading && paragraphs.length === 0 && ctaLinks.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (only if present).
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: single cell holding heading + paragraphs + CTA links.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...paragraphs);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cover', cells });
  element.replaceWith(block);
}
