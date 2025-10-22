// interactive-connections-background.tsx
import React, { useRef, useEffect } from 'react';

// 1. REMOVED 'children' from props
type InteractiveConnectionsBackgroundProps = {};

export function InteractiveConnectionsBackground({}: InteractiveConnectionsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 2. DELAY ANIMATION: Wrap entire effect body in a timer
    const startAnimationTimer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferCanvas = bufferCanvasRef.current;
      const bufferCtx = bufferCanvas.getContext('2d');
      if (!bufferCtx) return;

      let animationFrameId: number;
      let particles: Particle[] = [];
      // 3. OPTIMIZATION: Create variable to hold the gradient
      let connectionGradient: CanvasGradient | string;
      const mouse = { x: -300, y: -300, radius: 150 };
      const targetMouse = { x: -300, y: -300 };
      const mouseRadiusSq = mouse.radius * mouse.radius;
      let cellSize = 150;
      let grid: Map<string, Particle[]> = new Map();
      let lastFrameTime = 0;
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const targetFPS = isMobile ? 30 : 60;
      let frameInterval = 1000 / targetFPS;
      let isInteracting = false;
      let resetTimer: NodeJS.Timeout | null = null;
      let avgFrameTime = frameInterval;

      function debounce(func: (...args: any[]) => void, delay: number) {
        let timeout: NodeJS.Timeout | null = null;
        return function(...args: any[]) {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), delay);
        };
      }

      const throttle = (fn: Function, delay: number) => {
        let lastCall = 0;
        return function (...args: any[]) {
          const now = Date.now();
          if (now - lastCall >= delay) {
            lastCall = now;
            return fn(...args);
          }
        };
      };

      // 4. OPTIMIZATION: Modify gradient function to accept params
      const createGradient = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(139, 98, 44, 0.8)');
        gradient.addColorStop(1, 'rgba(212, 167, 106, 0.4)');
        return gradient;
      };

      const resizeCanvas = () => {
        const parent = containerRef.current;
        if (parent) {
          const oldWidth = canvas.width;
          const oldHeight = canvas.height;
          canvas.width = parent.offsetWidth;
          canvas.height = parent.offsetHeight;
          bufferCanvas.width = canvas.width;
          bufferCanvas.height = canvas.height;

          // 5. OPTIMIZATION: Update the gradient variable on resize
          if (bufferCtx && !isMobile) {
            connectionGradient = createGradient(bufferCtx, canvas.width, canvas.height);
          } else {
            connectionGradient = '#d7c286'; // Mobile fallback
          }

          if (oldWidth !== canvas.width || oldHeight !== canvas.height) {
            createParticles(canvas);
          }
        }
      };

      const debouncedResize = debounce(resizeCanvas, 200);

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
          this.vx *= isMobile ? 0.78 : 0.99;
          this.vy *= isMobile ? 0.78 : 0.99;

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
        const densityFactor = isMobile ? 800 : 3000;
        const particleCount = Math.min(isMobile ? 180 : 400, Math.floor((canvasElement.width * canvasElement.height) / densityFactor));
        particles = Array.from({ length: particleCount }, () => new Particle(canvasElement));
        cellSize = isMobile ? 200 : 150;
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
                  const forceMultiplier = (isMobile ? 3.0 : 3) * forceBoost;
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

        const connectDistanceSq = isMobile ? 50 * 60 : 120 * 120;

        bufferCtx.globalAlpha = 0.4;
        // 6. OPTIMIZATION: Use the gradient variable here
        bufferCtx.strokeStyle = connectionGradient;

        bufferCtx.beginPath();
        for (const p1 of particles) {
          const gridX = Math.floor(p1.x / cellSize);
          const gridY = Math.floor(p1.y / cellSize);
          let connections = 0;
          const maxConnections = isMobile ? 3 : 10;
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
        mouse.radius = 250;
        mouse.x = targetMouse.x;
        mouse.y = targetMouse.y;
        for (let i = 0; i < 4; i++) {
          handleMouseInteraction(1.5);
        }
      };

      const handleTouchEnd = () => {
        resetTimer = setTimeout(() => {
          isInteracting = false;
          targetMouse.x = -300;
          targetMouse.y = -300;
          mouse.radius = 150;
        }, 1500);
      };

      const handleTouchCancel = () => {
        handleTouchEnd();
      };

      const animate = (timestamp: number) => {
        try {
          const delta = timestamp - lastFrameTime;
          if (delta < frameInterval) {
            animationFrameId = requestAnimationFrame(animate);
            return;
          }
          lastFrameTime = timestamp;
          avgFrameTime = avgFrameTime * 0.9 + delta * 0.1;

          if (avgFrameTime > frameInterval * 1.5 && isMobile) {
            frameInterval = Math.min(1000 / 20, frameInterval + 1);
          }

          const lerpFactor = isMobile ? 0.3 : 0.5;
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

          grid = new Map();
          for (const p of particles) {
            const gridX = Math.floor(p.x / cellSize);
            const gridY = Math.floor(p.y / cellSize);
            const key = `${gridX},${gridY}`;
            if (!grid.has(key)) grid.set(key, []);
            grid.get(key)!.push(p);
          }

          bufferCtx.globalAlpha = 1.0;
          handleMouseInteraction();
          handleConnections();

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(bufferCanvas, 0, 0);

          animationFrameId = requestAnimationFrame(animate);
        } catch (error) {
          console.error('Animation error:', error);
          // Don't request another frame if it errored
        }
      };

      // Everything below this point is still inside the setTimeout
      resizeCanvas();
      requestAnimationFrame(animate);

      const resizeObserver = new ResizeObserver(debouncedResize);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      window.addEventListener('resize', debouncedResize);
      const throttledUpdate = throttle(updatePointerPosition, 60);
      if (isMobile) {
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', throttledUpdate, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('touchcancel', handleTouchCancel, { passive: true });
      } else {
        window.addEventListener('mousemove', updatePointerPosition as EventListener);
      }

      // 7. DELAY ANIMATION: The cleanup must be returned *inside* the timer
      //    This function won't be registered until the timeout completes.
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', debouncedResize);
        if (isMobile) {
          window.removeEventListener('touchstart', handleTouchStart);
          window.removeEventListener('touchmove', throttledUpdate);
          window.removeEventListener('touchend', handleTouchEnd);
          window.removeEventListener('touchcancel', handleTouchCancel);
        } else {
          window.removeEventListener('mousemove', updatePointerPosition as EventListener);
        }
        cancelAnimationFrame(animationFrameId);
        if (resetTimer) clearTimeout(resetTimer);
      };
      
    }, 100); // 500ms delay

    // 8. DELAY ANIMATION: The main cleanup for the useEffect
    //    This cleans up the *timer itself* if the component unmounts early
    return () => {
      clearTimeout(startAnimationTimer);
      // Note: The inner cleanup (removing event listeners) is now handled
      // by the return function *inside* the setTimeout.
    };
  }, []);

  return (
    <section
      ref={containerRef}
      // 9. DECOUPLING: Use absolute positioning to fill parent
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ background: `linear-gradient(135deg, #040424 0%, #002c54 100%)` }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-80 z-0"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      />
      {/* 10. DECOUPLING: The 'children' wrapper has been removed */}
    </section>
  );
}