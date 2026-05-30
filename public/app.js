const SAMPLES = {
  equal: {
    left: 'line one\nline two\nline three',
    right: 'line one\nline two\nline three',
  },
  diff: {
    left: 'line one\nline two\nline three',
    right: 'line one\nline two\nCHANGED',
  },
};

document.getElementById('load-equal').addEventListener('click', () => {
  document.getElementById('left').value = SAMPLES.equal.left;
  document.getElementById('right').value = SAMPLES.equal.right;
});

document.getElementById('load-diff').addEventListener('click', () => {
  document.getElementById('left').value = SAMPLES.diff.left;
  document.getElementById('right').value = SAMPLES.diff.right;
});

document.getElementById('compare').addEventListener('click', async () => {
  const left = document.getElementById('left').value;
  const right = document.getElementById('right').value;
  const el = document.getElementById('result');
  const btn = document.getElementById('compare');
  el.textContent = 'Comparing…';
  el.className = 'result';
  btn.disabled = true;
  try {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ left, right }),
    });
    const data = await res.json();
    if (!res.ok) {
      el.textContent = data.error || 'Error';
      return;
    }
    el.className = data.equal ? 'result equal' : 'result diff';
    el.textContent = data.equal
      ? `Equal (1) — ${data.elapsedMs} ms`
      : `Different (0) — ${data.elapsedMs} ms`;
  } catch (err) {
    el.textContent = err.message;
  } finally {
    btn.disabled = false;
  }
});
