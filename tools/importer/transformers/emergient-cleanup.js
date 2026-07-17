/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: emergient.com site-wide cleanup.
 *
 * All selectors verified against migration-work/cleaned.html (WordPress site shell).
 * Removes non-authorable global chrome (WordPress navbar/header, site footer,
 * per-post entry-footer, screen-reader-only elements) and rewrites raw staging-IP
 * URLs to the canonical production origin so links and images resolve.
 *
 * Preserves authorable content: <header class="entry-header"> and
 * <div class="entry-content">.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Raw staging IP found in hrefs and hero cover <img src>; rewrite to production origin.
const STAGING_ORIGIN = 'http://18.119.152.158';
const PRODUCTION_ORIGIN = 'https://emergient.com';

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // URL fix before block parsing so parsers (e.g. hero-cover) extract corrected
    // href/src values. Rewrite raw staging IP -> production origin.
    // Found in captured DOM: hero cover <img src> and various links use the staging IP.
    element.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href && href.includes(STAGING_ORIGIN)) {
        a.setAttribute('href', href.split(STAGING_ORIGIN).join(PRODUCTION_ORIGIN));
      }
    });
    element.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && src.includes(STAGING_ORIGIN)) {
        img.setAttribute('src', src.split(STAGING_ORIGIN).join(PRODUCTION_ORIGIN));
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (selectors from captured DOM):
    // - #wrapper-navbar : WordPress navbar/header (handled by nav migration)
    // - #wrapper-footer : WordPress site footer (handled by footer migration)
    // - footer.entry-footer : per-post meta / "no comments" footer
    // - .screen-reader-text, .sr-only : screen-reader-only shell elements
    WebImporter.DOMUtils.remove(element, [
      '#wrapper-navbar',
      '#wrapper-footer',
      'footer.entry-footer',
      '.screen-reader-text',
      '.sr-only',
    ]);
  }
}
