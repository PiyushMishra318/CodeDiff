'use strict';

/** @typedef {'equal'|'delete'|'insert'|'change'} DiffKind */

/**
 * @typedef {object} DiffRow
 * @property {DiffKind} kind
 * @property {number} [leftNum]
 * @property {number} [rightNum]
 * @property {string} [content]
 * @property {string} [left]
 * @property {string} [right]
 */

/**
 * @param {string} text
 * @returns {string[]}
 */
function normalizeLines(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
}

/**
 * @param {string[]} a
 * @param {string[]} b
 * @returns {number[][]}
 */
function buildLcsTable(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

/**
 * @param {string[]} a
 * @param {string[]} b
 * @param {number[][]} dp
 * @returns {Array<{ type: 'equal'|'delete'|'insert', line: string, leftNum?: number, rightNum?: number }>}
 */
function backtrackDiff(a, b, dp) {
  const ops = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.unshift({ type: 'equal', line: a[i - 1], leftNum: i, rightNum: j });
      i -= 1;
      j -= 1;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: 'insert', line: b[j - 1], rightNum: j });
      j -= 1;
    } else {
      ops.unshift({ type: 'delete', line: a[i - 1], leftNum: i });
      i -= 1;
    }
  }

  return ops;
}

/**
 * @param {string} textA
 * @param {string} textB
 * @returns {DiffRow[]}
 */
function computeLineDiff(textA, textB) {
  const a = normalizeLines(textA);
  const b = normalizeLines(textB);
  const dp = buildLcsTable(a, b);
  const raw = backtrackDiff(a, b, dp);
  /** @type {DiffRow[]} */
  const rows = [];

  for (let i = 0; i < raw.length; i++) {
    const op = raw[i];
    const next = raw[i + 1];

    if (op.type === 'delete' && next?.type === 'insert') {
      rows.push({
        kind: 'change',
        leftNum: op.leftNum,
        rightNum: next.rightNum,
        left: op.line,
        right: next.line,
      });
      i += 1;
      continue;
    }

    if (op.type === 'equal') {
      rows.push({
        kind: 'equal',
        leftNum: op.leftNum,
        rightNum: op.rightNum,
        content: op.line,
      });
    } else if (op.type === 'delete') {
      rows.push({ kind: 'delete', leftNum: op.leftNum, left: op.line });
    } else {
      rows.push({ kind: 'insert', rightNum: op.rightNum, right: op.line });
    }
  }

  return rows;
}

/**
 * Line-by-line equality check matching CodeDiff.cpp semantics.
 * @param {string} a
 * @param {string} b
 */
function compareTexts(a, b) {
  const start = performance.now();
  const linesA = normalizeLines(a);
  const linesB = normalizeLines(b);
  let equal = linesA.length === linesB.length;

  if (equal) {
    for (let i = 0; i < linesA.length; i++) {
      if (linesA[i] !== linesB[i]) {
        equal = false;
        break;
      }
    }
  }

  const elapsedMs = performance.now() - start;
  return { equal, elapsedMs };
}

module.exports = {
  normalizeLines,
  computeLineDiff,
  compareTexts,
};
