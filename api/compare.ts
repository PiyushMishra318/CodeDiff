import type { VercelRequest, VercelResponse } from '@vercel/node';

/** Line-by-line equality check matching CodeDiff.cpp semantics. */
export function compareTexts(a: string, b: string): { equal: boolean; elapsedMs: number } {
  const start = performance.now();
  const linesA = a.replace(/\r\n/g, '\n').split('\n');
  const linesB = b.replace(/\r\n/g, '\n').split('\n');
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST JSON { left, right }' });
  }
  const left = typeof req.body?.left === 'string' ? req.body.left : '';
  const right = typeof req.body?.right === 'string' ? req.body.right : '';
  const { equal, elapsedMs } = compareTexts(left, right);
  return res.status(200).json({
    equal,
    result: equal ? 1 : 0,
    elapsedMs: Math.round(elapsedMs * 100) / 100,
  });
}
