import type { VercelRequest, VercelResponse } from '@vercel/node';
import { compareTexts, computeLineDiff } from '../lib/lineDiff.js';

export { compareTexts, computeLineDiff };

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST JSON { left, right }' });
  }
  const left = typeof req.body?.left === 'string' ? req.body.left : '';
  const right = typeof req.body?.right === 'string' ? req.body.right : '';
  const { equal, elapsedMs } = compareTexts(left, right);
  const diff = computeLineDiff(left, right);

  return res.status(200).json({
    equal,
    result: equal ? 1 : 0,
    elapsedMs: Math.round(elapsedMs * 100) / 100,
    diff,
  });
}
