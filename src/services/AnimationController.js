/**
 * AnimationController handles card entrance transitions, decorative effects,
 * and physics-based particle systems (Petals, Confetti, Stars, Sparkles).
 * Demonstrates OOP: State Pattern, Strategy Pattern, Observer Pattern.
 */
export class AnimationController {
  constructor(canvas, card) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._card = card;

    this._isPlaying = false;
    this._currentTime = 0;
    this._duration = 3.5; // in seconds
    this._entranceEffect = 'slide-up'; // 'fade-in', 'slide-up', 'scale-in', 'card-open'
    this._decorativeEffect = 'floating'; // 'none', 'floating', 'border-glow', 'shimmer'
    this._particleType = 'petals'; // 'none', 'petals', 'confetti', 'stars', 'sparkles'
    this._particles = [];
    this._animFrameId = null;
    this._lastTimestamp = 0;

    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  get isPlaying() { return this._isPlaying; }
  get currentTime() { return this._currentTime; }
  get duration() { return this._duration; }
  set duration(val) { this._duration = Math.max(1, Number(val)); }
  get entranceEffect() { return this._entranceEffect; }
  set entranceEffect(val) { this._entranceEffect = val; }
  get decorativeEffect() { return this._decorativeEffect; }
  set decorativeEffect(val) { this._decorativeEffect = val; }
  get particleType() { return this._particleType; }
  set particleType(val) {
    this._particleType = val;
    this._initParticles();
  }
  set card(newCard) {
    this._card = newCard;
  }

  play() {
    if (this._isPlaying) return;
    this._isPlaying = true;
    this._lastTimestamp = performance.now();
    this._initParticles();
    this._loop(this._lastTimestamp);
  }

  pause() {
    this._isPlaying = false;
    if (this._animFrameId) {
      cancelAnimationFrame(this._animFrameId);
      this._animFrameId = null;
    }
  }

  restart() {
    this._currentTime = 0;
    this._initParticles();
    if (!this._isPlaying) {
      this.play();
    }
  }

  seek(progress) {
    this._currentTime = Math.max(0, Math.min(this._duration, progress * this._duration));
    this.renderFrame();
  }

  _loop(timestamp) {
    if (!this._isPlaying) return;
    const dt = (timestamp - this._lastTimestamp) / 1000;
    this._lastTimestamp = timestamp;

    this._currentTime += dt;
    if (this._currentTime >= this._duration) {
      this._currentTime = this._duration;
      this.pause();
    }

    this.renderFrame();

    if (this._isPlaying) {
      this._animFrameId = requestAnimationFrame(t => this._loop(t));
    }
  }

  renderFrame() {
    if (!this._card || !this._ctx) return;
    const ctx = this._ctx;
    const w = this._canvas.width;
    const h = this._canvas.height;
    const progress = Math.min(1, this._currentTime / this._duration);

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Scale card coordinate space to canvas viewport
    const scale = Math.min(w / this._card.width, h / this._card.height);
    ctx.scale(scale, scale);

    // Apply Entrance Transform
    const entranceProgress = Math.min(1, this._currentTime / 1.2);
    this._applyEntrance(ctx, entranceProgress);

    // 1. Render Card Background
    this._card.renderBackground(ctx);

    // 2. Render Decorative Effect (e.g. animated gold border sweep)
    this._applyDecorative(ctx, progress);

    // 3. Render Card Elements
    const elements = this._card.elements;
    elements.forEach((el, index) => {
      ctx.save();
      // Optional stagger reveal for text
      if (this._entranceEffect === 'sequential-reveal' && el.type === 'text') {
        const itemDelay = 0.3 + index * 0.15;
        const itemProg = Math.max(0, Math.min(1, (this._currentTime - itemDelay) / 0.6));
        ctx.globalAlpha = itemProg;
      }
      el.render(ctx, { isExport: true });
      ctx.restore();
    });

    ctx.restore();

    // 4. Render Particle Physics System over canvas
    if (this._particleType !== 'none' && !this._reducedMotion) {
      this._updateAndRenderParticles(ctx, w, h, progress);
    }
  }

  _applyEntrance(ctx, t) {
    if (this._reducedMotion) return;
    const easeOutCubic = val => 1 - Math.pow(1 - val, 3);
    const p = easeOutCubic(t);
    const cx = this._card.width / 2;
    const cy = this._card.height / 2;

    switch (this._entranceEffect) {
      case 'fade-in':
        ctx.globalAlpha = p;
        break;

      case 'slide-up':
        ctx.globalAlpha = p;
        ctx.translate(0, (1 - p) * 120);
        break;

      case 'slide-in':
        ctx.globalAlpha = p;
        ctx.translate((1 - p) * -150, 0);
        break;

      case 'scale-in':
        ctx.globalAlpha = p;
        ctx.translate(cx, cy);
        ctx.scale(0.8 + 0.2 * p, 0.8 + 0.2 * p);
        ctx.translate(-cx, -cy);
        break;

      case 'card-open': {
        // 2.5D perspective fold illusion
        ctx.globalAlpha = p;
        ctx.translate(cx, cy);
        const foldAngle = (1 - p) * (Math.PI / 2);
        ctx.transform(Math.cos(foldAngle), 0, Math.sin(foldAngle) * 0.2, 1, 0, 0);
        ctx.translate(-cx, -cy);
        break;
      }
    }
  }

  _applyDecorative(ctx, progress) {
    if (this._decorativeEffect === 'border-glow') {
      ctx.save();
      ctx.strokeStyle = `rgba(198, 161, 91, ${0.4 + 0.5 * Math.sin(this._currentTime * 3)})`;
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, this._card.width - 20, this._card.height - 20);
      ctx.restore();
    } else if (this._decorativeEffect === 'floating') {
      const floatY = Math.sin(this._currentTime * 2) * 8;
      ctx.translate(0, floatY);
    }
  }

  _initParticles() {
    this._particles = [];
    if (this._particleType === 'none') return;

    const count = 40;
    const w = this._canvas.width;
    const h = this._canvas.height;

    for (let i = 0; i < count; i++) {
      this._particles.push({
        x: Math.random() * w,
        y: Math.random() * -h, // start above
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1.5 + Math.random() * 2.5,
        size: 5 + Math.random() * 12,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 4,
        color: this._getParticleColor(),
        alpha: 0.6 + Math.random() * 0.4
      });
    }
  }

  _getParticleColor() {
    if (this._particleType === 'petals') {
      return ['#F0A8A0', '#E8928A', '#F8E7E7', '#E28178'][Math.floor(Math.random() * 4)];
    } else if (this._particleType === 'confetti') {
      return ['#A61E2D', '#C6A15B', '#81917A', '#F0A8A0', '#641E32'][Math.floor(Math.random() * 5)];
    } else if (this._particleType === 'stars' || this._particleType === 'sparkles') {
      return ['#C6A15B', '#FAF7F0', '#E8C988', '#FFFFFF'][Math.floor(Math.random() * 4)];
    }
    return '#C6A15B';
  }

  _updateAndRenderParticles(ctx, w, h, progress) {
    ctx.save();
    this._particles.forEach(p => {
      p.x += p.vx + Math.sin(this._currentTime + p.y * 0.01) * 0.8;
      p.y += p.vy;
      p.rotation += p.vr;

      if (p.y > h + 20) {
        p.y = -20;
        p.x = Math.random() * w;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (this._particleType === 'petals') {
        // Petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (this._particleType === 'stars') {
        // 4-point sparkle star
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(0, 0, p.size, 0);
        ctx.quadraticCurveTo(0, 0, 0, p.size);
        ctx.quadraticCurveTo(0, 0, -p.size, 0);
        ctx.quadraticCurveTo(0, 0, 0, -p.size);
        ctx.fill();
      } else {
        // Confetti rectangular foil
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }

      ctx.restore();
    });
    ctx.restore();
  }

  destroy() {
    this.pause();
    this._particles = [];
  }
}
