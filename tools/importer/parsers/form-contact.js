/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form-contact. Base block: form.
 * Source: https://emergient.com/contact/ (WordPress Contact Form 7)
 * Generated: 2026-07-17
 *
 * The target form-contact block (blocks/form-contact/form-contact.js) is
 * JSON-driven: decorate() reads the block's a[href] links — the FIRST link is
 * the form-definition source (a spreadsheet/JSON describing the fields) and the
 * SECOND link is the submit endpoint. So the parser output is a 1-column block
 * whose cells hold those two links.
 *
 * The source CF7 form contains: Your name (text, required), Your email (email,
 * required), Subject (text, required), Your message (textarea, optional) and a
 * Submit button. That field definition is captured in the linked form document
 * (created during import); here we emit the links the block expects.
 *
 * NOTE: this block only appears on /contact/ (a coverage-gap of the
 * content-page template). The template representativeUrl
 * (/services-and-benefits/) does NOT contain the form container, so automatic
 * validation against the representativeUrl finds no element. Validate against
 * https://emergient.com/contact/ where the form actually exists.
 */
export default function parse(element, { document }) {
  const form = element.querySelector('form.wpcf7-form, form');

  // Empty-block guard: nothing to import if there's no form.
  if (!form) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Form-definition source: the sheet/JSON that describes the fields. Named to
  // match this contact form so the import produces a corresponding document.
  const source = document.createElement('a');
  source.href = '/forms/contact';
  source.textContent = '/forms/contact';

  // Submit endpoint: preserve the original form action where available so the
  // submission target is not lost, falling back to a project form endpoint.
  const action = (form.getAttribute('action') || '').split('#')[0].trim();
  const submit = document.createElement('a');
  submit.href = action || '/forms/contact-submit';
  submit.textContent = submit.getAttribute('href');

  // 1-column block: row 2 = form definition link, row 3 = submit endpoint link.
  const cells = [
    [source],
    [submit],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'form-contact', cells });
  element.replaceWith(block);
}
