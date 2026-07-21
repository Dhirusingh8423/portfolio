/**
 * High-Performance Vanilla JS Particle Network
 * Renders a neural network particle web on a canvas.
 * Interactive: responds to mouse position by pushing particles and drawing links to mouse.
 */

class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        // Colors from theme
        this.particleColor = 'rgba(59, 130, 246, 0.4)'; // Light Blue (#3B82F6) with opacity
        this.lineColor = 'rgba(37, 99, 235, 0.08)';    // Accent Blue (#2563EB) with low opacity
        
        this.init();
        this.animate();
        this.bindEvents();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    createParticles() {
        this.particles = [];
        // Scale number of particles based on screen width
        const density = Math.floor((this.canvas.width * this.canvas.height) / 9000);
        const particleCount = Math.min(Math.max(density, 40), 120);

        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 2 + 1; // 1px to 3px
            const x = Math.random() * (this.canvas.width - size * 2) + size;
            const y = Math.random() * (this.canvas.height - size * 2) + size;
            
            // Speed settings: slow and smooth
            const directionAngle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.4 + 0.1;
            const vx = Math.cos(directionAngle) * speed;
            const vy = Math.sin(directionAngle) * speed;

            this.particles.push({
                x,
                y,
                vx,
                vy,
                radius: size,
                originalAlpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            // Get relative canvas coordinates
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(59, 130, 246, ${p.originalAlpha})`;
            this.ctx.fill();
        }
    }

    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Move particles
            p.x += p.vx;
            p.y += p.vy;

            // Bounce on boundaries
            if (p.x < 0 || p.x > this.canvas.width) p.vx = -p.vx;
            if (p.y < 0 || p.y > this.canvas.height) p.vy = -p.vy;

            // Mouse interaction: push particles slightly when mouse gets close
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const distance = Math.hypot(dx, dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    // Move particle away from mouse
                    p.x += (dx / distance) * force * 1.5;
                    p.y += (dy / distance) * force * 1.5;
                }
            }
        }
    }

    connectParticles() {
        const maxDistance = 110;
        
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.hypot(dx, dy);

                if (distance < maxDistance) {
                    // Line alpha based on distance
                    const alpha = (1 - distance / maxDistance) * 0.15;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`; // Light blue tint
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }

            // Connect to mouse if close
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p1.x - this.mouse.x;
                const dy = p1.y - this.mouse.y;
                const distance = Math.hypot(dx, dy);

                if (distance < this.mouse.radius) {
                    const alpha = (1 - distance / this.mouse.radius) * 0.25;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`; // Accent blue link
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.connectParticles();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialise particle background on load
document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork('hero-canvas');
});
