/**
 * JP Matrix Background - Dynamic Generator
 * Fills the .jp-matrix grid with katakana characters
 * and randomly assigns animated pulse classes.
 */
(function () {
  const CHARS = [
    '1','0','1','0','0',
    '0','0','1','0','0',
    '0','1','1','0','1',
    '1','0','1','0','1',
    '1','0','0','0','1',
    '0','1','0','1','0',
    '1','1','1','0','0',
    '0','0','1',
    '1','0','1','0','0',
    '0','1','0',
    '1','0','1','1','0',
    '0','1','1','0','0',
    '1','0','1','0','1',
    '1','0','1','0','0',
    '0','1','0','1','1',
  ];

  // Pulse class options (6 variants with different speeds/delays)
  const PULSE_CLASSES = ['pulse-1', 'pulse-2', 'pulse-3', 'pulse-4', 'pulse-5', 'pulse-6'];

  // Probability that any given cell gets a pulse animation (~30%)
  const PULSE_CHANCE = 0.30;

  const container = document.getElementById('jp-matrix');
  if (!container) return;

  function fillGrid() {
    const cellSize = 36;
    const cols = Math.ceil(window.innerWidth / cellSize) + 1;
    const rows = Math.ceil(window.innerHeight / cellSize) + 1;
    const total = cols * rows;

    // Only rebuild if the cell count changed significantly
    if (Math.abs(container.childElementCount - total) < cols) return;

    container.innerHTML = '';
    const frag = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
      const span = document.createElement('span');
      span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];

      // Randomly assign a pulse animation class
      if (Math.random() < PULSE_CHANCE) {
        const cls = PULSE_CLASSES[Math.floor(Math.random() * PULSE_CLASSES.length)];
        span.className = cls;
        // Randomise the animation-delay so pulses don't sync up
        span.style.animationDelay = (Math.random() * 6).toFixed(2) + 's';
      }

      frag.appendChild(span);
    }

    container.appendChild(frag);
  }

  // Periodically shuffle a random character so the grid feels alive
  function shuffleRandomChar() {
    const spans = container.querySelectorAll('span');
    if (!spans.length) return;
    const idx = Math.floor(Math.random() * spans.length);
    spans[idx].textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  // Initial fill
  fillGrid();

  // Rebuild on significant resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fillGrid, 200);
  });

  // Updated: Shuffles a random character every 15ms for a faster, more dynamic shimmer effect
  setInterval(shuffleRandomChar, 15);
})();