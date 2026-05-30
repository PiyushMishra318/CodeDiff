'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

function compareTexts(a, b) {
  const norm = (s) => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const linesA = norm(a);
  const linesB = norm(b);
  let equal = linesA.length === linesB.length;
  if (equal) {
    for (let i = 0; i < linesA.length; i++) {
      if (linesA[i] !== linesB[i]) {
        equal = false;
        break;
      }
    }
  }
  return { equal, result: equal ? 1 : 0 };
}

describe('compareTexts', () => {
  it('reports equal for identical lines', () => {
    assert.equal(compareTexts('a\nb', 'a\nb').result, 1);
  });
  it('reports different for mismatched lines', () => {
    assert.equal(compareTexts('a', 'b').result, 0);
  });
});
