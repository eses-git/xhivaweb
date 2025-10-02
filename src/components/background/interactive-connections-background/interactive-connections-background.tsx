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
    const targetMouse = { x: -300, y: -300 }; // For smoothing
    const mouseRadiusSq = mouse.radius * mouse.radius;
    let cellSize = 150;
    let grid: Map<string, Particle[]> = new Map();
    let lastResize = 0;
    let lastFrameTime = 0;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent); // Simple mobile detection
    const targetFPS = isMobile ? 30 : 60; // Lower FPS on mobile
    let frameInterval = 1000 / targetFPS;
    let isInteracting = false; // Track if interacting (tap or move)
    let resetTimer: NodeJS.Timeout | null = null; // For fading out after interaction
    let avgFrameTime = frameInterval; // Track average frame time for dynamic FPS

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
        const springFactor = isMobile ? 0.002 : 0.003;
        this.vx += (this.baseX - this.x) * springFactor;
        this.vy += (this.baseY - this.y) * springFactor;
        this.vx *= isMobile ? 0.98 : 0.99;
        this.vy *= isMobile ? 0.98 : 0.99;

        // Clamp velocity to prevent jittery overshoots
        const maxVel = isMobile ? 2 : 4;
        this.vx = Math.max(-maxVel, Math.min(maxVel, this.vx));
        this.vy = Math.max(-maxVel, Math.min(maxVel, this.vy));

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
      const densityFactor = isMobile ? 3000 : 3000; // Fewer on mobile
      const particleCount = Math.min(isMobile ? 380 : 400, Math.floor((canvasElement.width * canvasElement.height) / densityFactor));
      particles = Array.from({ length: particleCount }, () => new Particle(canvasElement));
      cellSize = isMobile ? 250 : 150; // Larger cells on mobile
    };

    const handleMouseInteraction = (forceBoost = 1) => {
      if (!isInteracting) return;
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
                const force = (1 - distanceSq / mouseRadiusSq) * 0.5;
                const forceMultiplier = (isMobile ? 2.0 : 3) * forceBoost; // Boost on tap
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
        bufferCtx.shadowColor = 'transparent';
        bufferCtx.shadowBlur = 0;
      } else {
        bufferCtx.shadowColor = 'rgba(19, 17, 11, 0.8)';
        bufferCtx.shadowBlur = 5;
      }
      bufferCtx.lineWidth = 0.5;

      const connectDistanceSq = isMobile ? 50 * 50 : 120 * 120; // Smaller on mobile to reduce drawing
      grid = new Map();
      for (const p of particles) {
        const gridX = Math.floor(p.x / cellSize);
        const gridY = Math.floor(p.y / cellSize);
        const key = `${gridX},${gridY}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(p);
      }

      bufferCtx.globalAlpha = 0.4;
      bufferCtx.strokeStyle = isMobile ? '#d7c286' : createGradient();

      bufferCtx.beginPath();
      for (const p1 of particles) {
        const gridX = Math.floor(p1.x / cellSize);
        const gridY = Math.floor(p1.y / cellSize);
        let connections = 0;
        const maxConnections = isMobile ? 3 : 10; // Fewer on mobile to prevent blinking/perf issues
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

    const updatePointerPosition = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      if ('touches' in event) {
        const touch = event.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      targetMouse.x = clientX - rect.left;
      targetMouse.y = clientY - rect.top;
      isInteracting = true;
      if (resetTimer) clearTimeout(resetTimer);
    };

    const handleTouchStart = (event: TouchEvent) => {
      updatePointerPosition(event);
      mouse.radius = 200; // Larger for tap/move
      // Immediate position set for quick tap response
      mouse.x = targetMouse.x;
      mouse.y = targetMouse.y;
      // Apply boosted interaction multiple times for visible tap effect
      for (let i = 0; i < 3; i++) {
        handleMouseInteraction(1.5); // Boost force for tap
      }
    };

    const handleTouchEnd = () => {
      resetTimer = setTimeout(() => {
        isInteracting = false;
        targetMouse.x = -300;
        targetMouse.y = -300;
        mouse.radius = 150;
      }, 1500); // Even longer timeout for visible tap effect
    };

    const animate = (timestamp: number) => {
      const delta = timestamp - lastFrameTime;
      if (delta < frameInterval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp;
      avgFrameTime = avgFrameTime * 0.9 + delta * 0.1;

      // Dynamic FPS adjustment if lagging
      if (avgFrameTime > frameInterval * 1.5 && isMobile) {
        frameInterval = Math.min(1000 / 20, frameInterval + 1);
      }

      // Smooth mouse position (lerp)
      const lerpFactor = isMobile ? 0.3 : 0.5; // Lower on mobile for smoother scrolling interaction
      mouse.x = mouse.x * (1 - lerpFactor) + targetMouse.x * lerpFactor;
      mouse.y = mouse.y * (1 - lerpFactor) + targetMouse.y * lerpFactor;

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
      handleConnections(); // Draw every frame on mobile, optimized with fewer connections

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bufferCanvas, 0, 0);

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas);
    if (isMobile) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
      canvas.addEventListener('touchmove', updatePointerPosition, { passive: true });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    } else {
      window.addEventListener('mousemove', updatePointerPosition as EventListener);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (isMobile) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', updatePointerPosition);
        canvas.removeEventListener('touchend', handleTouchEnd);
      } else {
        window.removeEventListener('mousemove', updatePointerPosition as EventListener);
      }
      cancelAnimationFrame(animationFrameId);
      if (resetTimer) clearTimeout(resetTimer);
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