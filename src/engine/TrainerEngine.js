class Target {
    constructor(x, y, radius, speed, direction, mode) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseRadius = radius;
        this.mode = mode;
        this.spawnTime = Date.now();
        this.id = Math.random().toString(36).substr(2, 9);

        // Movement for 'moving' mode
        const angle = direction || Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.opacity = 0;
        this.scale = 0.5;
        this.isDead = false;
    }

    update(width, height) {
        // Fade in
        if (this.opacity < 1) this.opacity += 0.1;
        if (this.scale < 1) this.scale += 0.05;

        // Movement
        if (this.mode === 'moving') {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce
            if (this.x - this.radius < 0 || this.x + this.radius > width) this.vx *= -1;
            if (this.y - this.radius < 0 || this.y + this.radius > height) this.vy *= -1;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Outer Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f2ff';

        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * this.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2ff';
        ctx.fill();

        // Ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.radius + 5) * this.scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}

class Ripple {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.opacity = 1;
        this.color = color;
    }

    update() {
        this.radius += 2;
        this.opacity -= 0.02;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

export class TrainerEngine {
    constructor(canvas, ctx, settings, callbacks) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.settings = settings;
        this.callbacks = callbacks;
        this.targets = [];
        this.ripples = [];
        this.isRunning = false;
        this.lastSpawn = 0;
        this.animationFrame = null;
        this.timer = 0;
        this.sessionStart = 0;
        this.audioCtx = null;
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playSynth(freq, type, duration) {
        if (!this.settings.soundEnabled) return;
        this.initAudio();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    start() {
        this.isRunning = true;
        this.sessionStart = Date.now();
        this.loop();
    }

    pause() {
        this.isRunning = false;
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }

    stop() {
        this.isRunning = false;
        this.targets = [];
        this.ripples = [];
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.clear();
    }

    resize() {
        // Canvas dimensions are handled by component, this just clears
        this.clear();
    }

    updateSettings(settings) {
        this.settings = settings;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    spawnTarget() {
        const margin = 100;
        const x = margin + Math.random() * (this.canvas.width - margin * 2);
        const y = margin + Math.random() * (this.canvas.height - margin * 2);

        let radius = this.settings.targetSize;
        let speed = 0;

        if (this.settings.difficulty === 'easy') { radius *= 1.5; speed = 1; }
        if (this.settings.difficulty === 'hard') { radius *= 0.7; speed = 3; }
        if (this.settings.mode === 'precision') { radius *= 0.5; }
        if (this.settings.mode === 'moving') { speed = speed || 2; }

        this.targets.push(new Target(x, y, radius, speed, null, this.settings.mode));
        this.lastSpawn = Date.now();
    }

    handleClick(x, y) {
        if (!this.isRunning) return;

        let hit = false;
        for (let i = this.targets.length - 1; i >= 0; i--) {
            const t = this.targets[i];
            const dist = Math.sqrt((x - t.x) ** 2 + (y - t.y) ** 2);

            if (dist < t.radius) {
                const reactionTime = Date.now() - t.spawnTime;
                this.targets.splice(i, 1);
                this.ripples.push(new Ripple(x, y, '#39ff14'));
                this.playSynth(800, 'sine', 0.1);
                this.callbacks.onHit(reactionTime);
                hit = true;
                break;
            }
        }

        if (!hit) {
            this.ripples.push(new Ripple(x, y, '#ff073a'));
            this.playSynth(150, 'sawtooth', 0.1);
            this.callbacks.onMiss();
        }
    }

    loop() {
        if (!this.isRunning) return;

        this.clear();

        const now = Date.now();
        const spawnRate = this.settings.difficulty === 'hard' ? this.settings.spawnRate * 0.7 :
            this.settings.difficulty === 'easy' ? this.settings.spawnRate * 1.5 :
                this.settings.spawnRate;

        // Spawn Logic
        if (now - this.lastSpawn > spawnRate && this.targets.length < 5) {
            this.spawnTarget();
        }

        // Time Attack Check
        if (this.settings.mode === 'time-attack') {
            const elapsed = (now - this.sessionStart) / 1000;
            if (elapsed > 30) {
                this.stop();
                this.callbacks.onEnd();
                return;
            }
        }

        // Update & Draw Targets
        this.targets.forEach((t, index) => {
            t.update(this.canvas.width, this.canvas.height);
            t.draw(this.ctx);

            // Auto-despawn for static mode if too old
            if (this.settings.mode === 'static' && now - t.spawnTime > 2000) {
                this.targets.splice(index, 1);
                this.callbacks.onMiss();
            }
        });

        // Update & Draw Ripples
        this.ripples.forEach((r, index) => {
            r.update();
            r.draw(this.ctx);
            if (r.opacity <= 0) this.ripples.splice(index, 1);
        });

        this.animationFrame = requestAnimationFrame(() => this.loop());
    }
}
