document.getElementById('compare').addEventListener('click', async () => {
  const left = document.getElementById('left').value;
  const right = document.getElementById('right').value;
  const el = document.getElementById('result');
  el.textContent = 'Comparing…';
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
  el.className = data.equal ? 'equal' : 'diff';
  el.textContent = data.equal
    ? `Equal (1) — ${data.elapsedMs}ms`
    : `Different (0) — ${data.elapsedMs}ms`;
});
