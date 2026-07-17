/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import emergientCleanupTransformer from './transformers/emergient-cleanup.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
// legal-page is entirely default content (no blocks).
const PAGE_TEMPLATE = {
  name: 'legal-page',
  description: 'Legal/policy page with page title heading and long-form body text; entirely default content',
  urls: [
    'https://emergient.com/privacy-policy/',
    'https://emergient.com/terms-and-conditions/',
  ],
  blocks: [],
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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);
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
        blocks: [],
      },
    }];
  },
};
