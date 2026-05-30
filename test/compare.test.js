'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { compareTexts } = require('../lib/lineDiff.js');

describe('compareTexts', () => {
  it('reports equal for identical lines', () => {
    assert.equal(compareTexts('a\nb', 'a\nb').equal, true);
  });
  it('reports different for mismatched lines', () => {
    assert.equal(compareTexts('a', 'b').equal, false);
  });
});
