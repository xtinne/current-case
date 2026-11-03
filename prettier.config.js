// @ts-check
const ionic = require('@ionic/prettier-config');

/** @type {import('prettier').Config} */
module.exports = {
  ...ionic,
  overrides: [
    ...ionic.overrides,
    // Format templates as Angular, so @if/@for blocks are indented.
    { files: '*.html', options: { parser: 'angular' } },
  ],
};
