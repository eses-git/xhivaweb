// src/background/interactive-connections-background-light/interactive-connections-background-light.tsx

import React, { useRef, useEffect } from 'react';

type InteractiveConnectionsBackgroundProps = {
  children: React.ReactNode;
};

export function InteractiveConnectionsBackgroundLight({ children }: InteractiveConnectionsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const bufferCanvas = bufferCanvasRef.current;
    const bufferCtx = bufferCanvas.getContext('2d');
    if (!bufferCtx) {
      console.error('Failed to get buffer context');
      return;
    }

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -300, y: -300, radius: 150 };
    const mouseRadiusSq = mouse.radius * mouse.radius;
    let cellSize = 150;
    const grid: Map<string, Particle[]> = new Map();
    let lastFrameTime = 0;
    // NEW: Make isMobile a function based on current width for consistency with CSS media and dynamic resizes
    const isMobile = () => window.innerWidth <= 768;
    let prevIsMobile = isMobile(); // Track to detect mode switches
    const targetFPS = isMobile() ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    // NEW: Debounce function for resize events
    function debounce(func: (...args: any[]) => void, delay: number) {
      let timeout: NodeJS.Timeout | null = null;
      return function(...args: any[]) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
      };
    }

    const resizeCanvas = () => {
      try {
        const parent = containerRef.current;
        if (parent) {
          const oldWidth = canvas.width;
          const oldHeight = canvas.height;
          const newWidth = parent.offsetWidth;
          const newHeight = parent.offsetHeight;
          canvas.width = newWidth;
          canvas.height = newHeight;
          bufferCanvas.width = newWidth;
          bufferCanvas.height = newHeight;

          const currentIsMobile = isMobile();

          // NEW: Only full recreate if first time or mode switched (mobile/desktop)
          if (oldWidth === 0 || oldHeight === 0 || currentIsMobile !== prevIsMobile) {
            createParticles(canvas);
            prevIsMobile = currentIsMobile;
            console.log(`Full recreate: ${newWidth}x${newHeight}, particles: ${particles.length}, mobile: ${currentIsMobile}`); // Debug
          } else if (oldWidth !== newWidth || oldHeight !== newHeight) {
            // NEW: Scale existing particles proportionally
            const scaleX = newWidth / oldWidth;
            const scaleY = newHeight / oldHeight;
            particles.forEach(p => {
              p.baseX *= scaleX;
              p.baseY *= scaleY;
              p.x *= scaleX;
              p.y *= scaleY;
            });

            // NEW: Adjust particle count to maintain density (add/remove as needed)
            const densityFactor = currentIsMobile ? 4000 : 3000;
            const maxParticles = currentIsMobile ? 300 : 700;
            const targetCount = Math.min(maxParticles, Math.floor((newWidth * newHeight) / densityFactor));
            let currentCount = particles.length;

            if (targetCount > currentCount) {
              // Add new particles (they'll slide in naturally)
              for (let i = 0; i < targetCount - currentCount; i++) {
                particles.push(new Particle(canvas));
              }
            } else if (targetCount < currentCount) {
              // Remove random particles
              particles = particles.sort(() => Math.random() - 0.5).slice(0, targetCount);
            }

            console.log(`Adjusted: ${newWidth}x${newHeight}, particles: ${particles.length}`); // Debug
          }

          // NEW: Always update cellSize on resize
          cellSize = currentIsMobile ? 200 : 150;
        }
      } catch (error) {
        console.error('Resize error:', error);
      }
    };

    // MODIFIED: Debounced versions of resize
    const debouncedResize = debounce(resizeCanvas, 200); // 200ms delay; adjust if needed

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
        const offset = 50; // Reduced offset for faster appearance
        if (Math.random() > 0.5) {
          this.x = -offset + Math.random() * 20; // Smaller random
          this.vx = (3 + Math.random() * 4) * this.z; // Increased velocity for faster slide-in
        } else {
          this.x = canvasElement.width + offset - Math.random() * 20;
          this.vx = (-3 - Math.random() * 4) * this.z;
        }
        this.y = this.baseY + (Math.random() * 50 - 25); // Reduced y offset
        this.vy = (Math.random() * 4 - 2) * this.z;
        this.size = (Math.random() * 3 + 2) * this.z;
        this.color = Math.random() > 0.5 ? '#ecc24eff' : '#cececaff';
      }

      update(canvasElement: HTMLCanvasElement) {
        const springFactor = 0.01; // Increased for faster settling
        this.vx += (this.baseX - this.x) * springFactor;
        this.vy += (this.baseY - this.y) * springFactor;
        this.vx *= 0.98; // Slightly less damping for quicker movement
        this.vy *= 0.98;

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
      // MODIFIED: Use function for isMobile
      const currentIsMobile = isMobile();
      const densityFactor = currentIsMobile ? 4000 : 3000;
      const particleCount = Math.min(currentIsMobile ? 300 : 700, Math.floor((canvasElement.width * canvasElement.height) / densityFactor));
      particles = Array.from({ length: particleCount }, () => new Particle(canvasElement));
      cellSize = currentIsMobile ? 200 : 150;
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
                const forceMultiplier = isMobile() ? 1.5 : 3;
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
      if (isMobile()) {
        bufferCtx.shadowColor = 'transparent';
        bufferCtx.shadowBlur = 0;
      } else {
        bufferCtx.shadowColor = '#f4e383ff';
        bufferCtx.shadowBlur = 5;
      }
      bufferCtx.lineWidth = 0.5;

      const connectDistanceSq = isMobile() ? 80 * 80 : 120 * 120;
      grid.clear(); // NEW: Clear grid each frame (wasn't cleared before; minor fix)
      for (const p of particles) {
        const gridX = Math.floor(p.x / cellSize);
        const gridY = Math.floor(p.y / cellSize);
        const key = `${gridX},${gridY}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(p);
      }

      bufferCtx.globalAlpha = 0.4;
      bufferCtx.strokeStyle = isMobile() ? '#d7c286' : createGradient();

      bufferCtx.beginPath();
      for (const p1 of particles) {
        const gridX = Math.floor(p1.x / cellSize);
        const gridY = Math.floor(p1.y / cellSize);
        let connections = 0;
        const maxConnections = isMobile() ? 5 : 10;
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
      gradient.addColorStop(0, 'rgba(246, 205, 152, 0.8)');
      gradient.addColorStop(1, 'rgba(221, 182, 129, 0.56)');
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

    const handleTouchStart = (event: TouchEvent) => {
      handlePointerMove(event);
    };

    // NEW: Handle touch end/cancel to reset mouse pos
    const handleTouchEnd = () => {
      mouse.x = -300;
      mouse.y = -300;
    };

    const animate = (timestamp: number) => {
      try {
        if (timestamp - lastFrameTime < frameInterval) {
          animationFrameId = requestAnimationFrame(animate);
          return;
        }
        lastFrameTime = timestamp;

        bufferCtx.clearRect(0, 0, canvas.width, canvas.height);

        if (!isMobile()) {
          bufferCtx.shadowColor = '#d7c186eb';
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
      } catch (error) {
        console.error('Animation error:', error);
      }
    };

    // Immediate resize on mount
    resizeCanvas();

    // MODIFIED: Use ResizeObserver with debounced callback
    const resizeObserver = new ResizeObserver(debouncedResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    requestAnimationFrame(animate);

    window.addEventListener('resize', debouncedResize); // MODIFIED: Fallback now debounced
    window.addEventListener('mousemove', handlePointerMove as EventListener);
    canvas.addEventListener('touchmove', handlePointerMove as EventListener, { passive: true });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true }); // NEW
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: true }); // NEW

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('mousemove', handlePointerMove as EventListener);
      canvas.removeEventListener('touchmove', handlePointerMove as EventListener);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.85) 33%, rgba(255, 255, 255, 0.85) 66%, rgba(255, 255, 255, 0.85) 100%)'
 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-80 z-0 pointer-events-auto"
        style={{ willChange: 'transform' }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}