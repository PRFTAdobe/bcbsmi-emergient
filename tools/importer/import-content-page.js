/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCoverParser from './parsers/hero-cover.js';
import formContactParser from './parsers/form-contact.js';

// TRANSFORMER IMPORTS
import emergientCleanupTransformer from './transformers/emergient-cleanup.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'content-page',
  description: 'Interior content page with hero cover banner and two-column content; contact variant includes a contact form',
  urls: [
    'https://emergient.com/services-and-benefits/',
    'https://emergient.com/about-emergient/',
    'https://emergient.com/contact/',
  ],
  blocks: [
    {
      name: 'hero-cover',
      instances: [
        'div.wp-block-cover.alignfull.has-custom-content-position',
        '.entry-content > .wp-block-cover',
      ],
    },
    {
      name: 'form-contact',
      instances: [
        'div.wp-block-contact-form-7-contact-form-selector',
        '.wpcf7',
      ],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-cover': heroCoverParser,
  'form-contact': formContactParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  emergientCleanupTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
