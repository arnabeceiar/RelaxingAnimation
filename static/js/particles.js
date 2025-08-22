const canvas = document.getElementById('smoke-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
resize();
window.addEventListener('resize', resize);

// Utility to get random number in range
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

class Particle {
  constructor(originX, originY, colorHue) {
    this.originX = originX;
    this.originY = originY;
    this.reset();
    this.colorHue = colorHue;
  }

  reset() {
    this.x = this.originX;
    this.y = this.originY;
    this.size = randomRange(5, 18);
    this.alpha = 1.0;
    // Velocity based on random angle and speed
    const angle = randomRange(-Math.PI / 3, Math.PI / 3); // spread angle
    const speed = randomRange(1, 4);
    this.vx = speed * Math.cos(angle);
    this.vy = speed * Math.sin(angle) - 2;  // slight upward bias for smoke rise
    this.ax = 0;  // No horizontal acceleration by default
    this.ay = 0.04; // gravity-like downward acceleration to simulate settling/falling
    this.life = randomRange(70, 120);  // lifespan in frames
    this.colorHue = this.colorHue || randomRange(0, 360);
  }

  update() {
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 1 / this.life;
    this.size *= 0.97; // gradual particle shrink
    if (this.alpha <= 0 || this.size <= 0) {
      this.reset();
    }
  }

  draw(ctx) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, `hsla(${this.colorHue}, 80%, 70%, ${this.alpha})`);
    gradient.addColorStop(0.5, `hsla(${this.colorHue}, 80%, 50%, ${this.alpha * 0.3})`);
    gradient.addColorStop(1, `hsla(${this.colorHue}, 80%, 30%, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Container to hold and animate multiple particles emitted from a position
class ParticleEmitter {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.maxParticles = 150;
    this.colorHueStart = randomRange(0, 360);
  }

  emit() {
    if (this.particles.length < this.maxParticles) {
      // Create new particle with a shifting color hue around the start hue
      const hueVariation = randomRange(-30, 30);
      const colorHue = (this.colorHueStart + hueVariation + 360) % 360;
      this.particles.push(new Particle(this.x, this.y, colorHue));
    }
  }

  update() {
    this.emit();
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      if (p.alpha <= 0 || p.size <= 0) {
        // Remove dead particles
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      p.draw(ctx);
    }
  }

  // Update emitter position (for interactive mouse/finger control)
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Initialize the emitter somewhere center-bottom by default
const emitter = new ParticleEmitter(window.innerWidth / 2, window.innerHeight * 0.85);

function animate() {
  ctx.clearRect(0, 0, width, height);
  emitter.update();
  emitter.draw(ctx);
  requestAnimationFrame(animate);
}

animate();

// Update emitter position on mouse movement or touch for interaction
function onPointerMove(e) {
  let x, y;
  if (e.touches && e.touches.length > 0) {
    x = e.touches[0].clientX;
    y = e.touches.clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }
  emitter.setPosition(x, y);
}

window.addEventListener('mousemove', onPointerMove);
window.addEventListener('touchmove', onPointerMove);
