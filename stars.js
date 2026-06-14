/**
 * Animated Starfield - Canvas-based
 * Three layers of stars with different speeds (parallax effect)
 */
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');

  // ─── Config ──────────────────────────────────────────────
  const LAYERS = [
    { count: 500, radius: 0.6, speed: 0.15, opacity: 0.7 },  // small, slow
    { count: 200, radius: 1.2, speed: 0.35, opacity: 0.85 }, // medium
    { count: 100, radius: 2.0, speed: 0.65, opacity: 1.0 },  // large, fast
  ];

  // ─── State ───────────────────────────────────────────────
  let W = 0, H = 0;
  let stars = [];
  let animId = null;

  // ─── Helpers ─────────────────────────────────────────────
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createStar(layer, layerIndex) {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: layer.radius + rand(-0.2, 0.2),
      speed: layer.speed + rand(-0.05, 0.05),
      opacity: layer.opacity,
      twinkleSpeed: rand(0.005, 0.02),
      twinkleOffset: rand(0, Math.PI * 2),
      layer: layerIndex,
    };
  }

  function initStars() {
    stars = [];
    LAYERS.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push(createStar(layer, li));
      }
    });
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
  }

  // ─── Draw ────────────────────────────────────────────────
  function drawBackground() {
    const grad = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, Math.max(W, H));
    grad.addColorStop(0, '#1b2735');
    grad.addColorStop(1, '#090a0f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  let tick = 0;

  function drawStars() {
    stars.forEach(s => {
      // Subtle twinkle using sin wave
      const twinkle = Math.sin(tick * s.twinkleSpeed + s.twinkleOffset);
      const alpha = s.opacity * (0.75 + 0.25 * twinkle);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      // Add a soft glow for large stars
      if (s.r > 1.5) {
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
        glow.addColorStop(0, `rgba(180, 220, 255, ${alpha * 0.4})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }
    });
  }

  function updateStars() {
    stars.forEach(s => {
      s.y -= s.speed;
      // Wrap around when star exits top
      if (s.y + s.r < 0) {
        s.y = H + s.r;
        s.x = rand(0, W);
      }
    });
  }

  // ─── Loop ────────────────────────────────────────────────
  function loop() {
    tick++;
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawStars();
    updateStars();
    animId = requestAnimationFrame(loop);
  }

  // ─── Init ────────────────────────────────────────────────
  window.addEventListener('resize', resize);
  resize();
  loop();
})();
