import React, { useRef, useEffect } from 'react';

type InteractiveConnectionsBackgroundProps = {
  children: React.ReactNode;
};

export function InteractiveConnectionsBackground({ children }: InteractiveConnectionsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferCanvas = bufferCanvasRef.current;
    const bufferCtx = bufferCanvas.getContext('2d');
    if (!bufferCtx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -300, y: -300, radius: 150 };
    const mouseRadiusSq = mouse.radius * mouse.radius;
    let cellSize = 150;
    let grid: Map<string, Particle[]> = new Map();
    let lastResize = 0;
    let lastFrameTime = 0;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent); // Simple mobile detection
    const targetFPS = isMobile ? 30 : 60; // Lower FPS on mobile
    const frameInterval = 1000 / targetFPS;

    const resizeCanvas = () => {
      const now = Date.now();
      if (now - lastResize < 100) return; // Debounce
      lastResize = now;

      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        bufferCanvas.width = canvas.width;
        bufferCanvas.height = canvas.height;
        createParticles(canvas);
      }
    };

    class Particle {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor(canvasElement: HTMLCanvasElement) {
        this.z = Math.random() * 0.7 + 0.3;
        this.baseX = Math.random() * canvasElement.width;
        this.baseY = Math.random() * canvasElement.height;
        this.x = this.baseX + (Math.random() * 100 - 50);
        this.y = this.baseY + (Math.random() * 100 - 50);
        this.vx = (Math.random() * 4 - 2) * this.z;
        this.vy = (Math.random() * 4 - 2) * this.z;
        this.size = (Math.random() * 3 + 2) * this.z;
        this.color = Math.random() > 0.5 ? '#a37840ff' : '#CACDCE';
      }

      update(canvasElement: HTMLCanvasElement) {
        const springFactor = 0.003;
        this.vx += (this.baseX - this.x) * springFactor;
        this.vy += (this.baseY - this.y) * springFactor;
        this.vx *= 0.99;
        this.vy *= 0.99;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.size < 0 || this.x + this.size > canvasElement.width) this.vx *= -1;
        if (this.y - this.size < 0 || this.y + this.size > canvasElement.height) this.vy *= -1;
      }

      draw() {
        if (!bufferCtx) return;
        bufferCtx.beginPath();
        bufferCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        bufferCtx.globalAlpha = this.z * 0.9;
        bufferCtx.fillStyle = this.color;
        bufferCtx.fill();
      }
    }

    const createParticles = (canvasElement: HTMLCanvasElement) => {
      const densityFactor = isMobile ? 6000 : 3000; // Less dense on mobile
      const particleCount = Math.min(isMobile ? 200 : 400, Math.floor((canvasElement.width * canvasElement.height) / densityFactor));
      particles = Array.from({ length: particleCount }, () => new Particle(canvasElement));
      cellSize = isMobile ? 200 : 150; // Larger cells on mobile for fewer checks
    };

    const handleMouseInteraction = () => {
      const gridX = Math.floor(mouse.x / cellSize);
      const gridY = Math.floor(mouse.y / cellSize);
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const key = `${gridX + i},${gridY + j}`;
          if (grid.has(key)) {
            for (const particle of grid.get(key)!) {
              const dx = particle.x - mouse.x;
              const dy = particle.y - mouse.y;
              const distanceSq = dx * dx + dy * dy;
              if (distanceSq < mouseRadiusSq) {
                const distance = Math.sqrt(distanceSq);
                const force = 1 - distanceSq / mouseRadiusSq;
                const forceMultiplier = isMobile ? 1.5 : 3; // Weaker force on mobile
                const directionX = (dx / distance) * force * forceMultiplier * particle.z;
                const directionY = (dy / distance) * force * forceMultiplier * particle.z;
                particle.vx += directionX;
                particle.vy += directionY;
              }
            }
          }
        }
      }
    };

    const handleConnections = () => {
      if (isMobile) {
        bufferCtx.shadowColor = 'transparent'; // Disable shadows on mobile
        bufferCtx.shadowBlur = 0;
      } else {
        bufferCtx.shadowColor = 'rgba(19, 17, 11, 0.8)';
        bufferCtx.shadowBlur = 5;
      }
      bufferCtx.lineWidth = 0.5;

      const connectDistanceSq = isMobile ? 80 * 80 : 120 * 120; // Shorter connections on mobile
      grid = new Map();
      for (const p of particles) {
        const gridX = Math.floor(p.x / cellSize);
        const gridY = Math.floor(p.y / cellSize);
        const key = `${gridX},${gridY}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(p);
      }

      bufferCtx.globalAlpha = 0.4;
      bufferCtx.strokeStyle = isMobile ? '#d7c286' : createGradient(); // Simple color on mobile, gradient on desktop

      bufferCtx.beginPath();
      for (const p1 of particles) {
        const gridX = Math.floor(p1.x / cellSize);
        const gridY = Math.floor(p1.y / cellSize);
        let connections = 0;
        const maxConnections = isMobile ? 5 : 10; // Fewer on mobile
        for (let i = -1; i <= 1 && connections < maxConnections; i++) {
          for (let j = -1; j <= 1 && connections < maxConnections; j++) {
            const key = `${gridX + i},${gridY + j}`;
            if (grid.has(key)) {
              for (const p2 of grid.get(key)!) {
                if (p1 === p2 || connections >= maxConnections) continue;
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distanceSq = dx * dx + dy * dy;
                if (distanceSq < connectDistanceSq) {
                  bufferCtx.moveTo(p1.x, p1.y);
                  bufferCtx.lineTo(p2.x, p2.y);
                  connections++;
                }
              }
            }
          }
        }
      }
      bufferCtx.stroke();
    };

    const createGradient = () => {
      const gradient = bufferCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(139, 98, 44, 0.8)');
      gradient.addColorStop(1, 'rgba(212, 167, 106, 0.4)');
      return gradient;
    };

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in event) {
        const touch = event.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
      } else {
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
      }
    };

    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp;

      bufferCtx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isMobile) {
        bufferCtx.shadowColor = 'rgba(166, 122, 65, 0.8)';
        bufferCtx.shadowBlur = 12;
      } else {
        bufferCtx.shadowColor = 'transparent';
        bufferCtx.shadowBlur = 0;
      }

      particles.forEach(particle => {
        particle.update(canvas);
        particle.draw();
      });

      bufferCtx.globalAlpha = 1.0;
      handleMouseInteraction();
      handleConnections();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bufferCanvas, 0, 0);

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handlePointerMove as EventListener);
    canvas.addEventListener('touchmove', handlePointerMove as EventListener, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handlePointerMove as EventListener);
      canvas.removeEventListener('touchmove', handlePointerMove as EventListener);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, #040424 0%, #002c54 100%)` }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-80 z-0"
        style={{ willChange: 'transform' }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}