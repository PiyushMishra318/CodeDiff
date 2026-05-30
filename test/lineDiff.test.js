'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { computeLineDiff, normalizeLines } = require('../lib/lineDiff.js');

describe('normalizeLines', () => {
  it('normalizes CRLF to LF splits', () => {
    assert.deepEqual(normalizeLines('a\r\nb'), ['a', 'b']);
  });
});

describe('computeLineDiff', () => {
  it('returns equal rows for identical input', () => {
    const rows = computeLineDiff('a\nb', 'a\nb');
    assert.deepEqual(rows, [
      { kind: 'equal', leftNum: 1, rightNum: 1, content: 'a' },
      { kind: 'equal', leftNum: 2, rightNum: 2, content: 'b' },
    ]);
  });

  it('marks a changed line as change', () => {
    const rows = computeLineDiff('old', 'new');
    assert.deepEqual(rows, [
      { kind: 'change', leftNum: 1, rightNum: 1, left: 'old', right: 'new' },
    ]);
  });

  it('marks insertions and deletions as change when paired', () => {
    const rows = computeLineDiff('keep\nremove', 'keep\nadd');
    assert.equal(rows[0].kind, 'equal');
    assert.equal(rows[1].kind, 'change');
    assert.equal(rows[1].left, 'remove');
    assert.equal(rows[1].right, 'add');
  });
});
