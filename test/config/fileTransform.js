'use strict';

const path = require('path');

// Turns file imports into filenames.
module.exports = {
  process(src, filename) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  }
};
