import React, { useRef, useEffect } from 'react';

type InteractiveWavesBackgroundProps = {
  children: React.ReactNode;
};

export function InteractiveWavesBackground({ children }: InteractiveWavesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const bufferCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas ref is null");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get 2D context");
      return;
    }
    
    const bufferCanvas = bufferCanvasRef.current;
    bufferCanvas.width = canvas.width;
    bufferCanvas.height = canvas.height;
    const bufferCtx = bufferCanvas.getContext('2d');
    if (!bufferCtx) return;
    bufferCtxRef.current = bufferCtx;

    let animationFrameId: number;
    let waves: WaveLine[] = [];
    const mouse = { x: -300, y: -300, radius: 300 };
    const targetMouse = { x: -300, y: -300 };
    let mouseRadiusSq = mouse.radius * mouse.radius;
    let lastFrameTime = 0;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const targetFPS = isMobile ? 30 : 60;
    let frameInterval = 1000 / targetFPS;
    let isInteracting = false;
    let resetTimer: NodeJS.Timeout | null = null;
    let avgFrameTime = frameInterval;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout | null = null;

    function debounce(func: (...args: any[]) => void, delay: number) {
      let timeout: NodeJS.Timeout | null = null;
      return function (...args: any[]) {
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

    const resizeCanvas = () => {
      const parent = containerRef.current;
      if (parent) {
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        
        if (canvas.width === 0 || canvas.height === 0) {
          console.warn("Canvas size is zero. Parent container may not have height.");
        }
        
        bufferCanvas.width = canvas.width;
        bufferCanvas.height = canvas.height;
        if (oldWidth !== canvas.width || oldHeight !== canvas.height) {
          createWaves(canvas);
        }
      } else {
        console.warn("Container ref is null on resize");
      }
    };

    const debouncedResize = debounce(resizeCanvas, 200);

    class WaveLine {
      baseX: number;
      phase: number;
      amp: number;
      freq: number;
      color: string;
      speed: number;
      points: { y: number, x: number }[] = [];

      constructor(baseX: number, canvas: HTMLCanvasElement) {
        this.baseX = baseX;
        this.phase = Math.random() * Math.PI * 2;
        this.amp = (Math.random() * 15 + 10) * (isMobile ? 0.8 : 1) * 1.5;
        this.freq = 0.005 + Math.random() * 0.005;
        this.speed = 0.005 + Math.random() * 0.005;
        const alpha = 0.05 + Math.random() * 0.15;
        this.color = `rgba(173, 216, 230, ${alpha})`;
      }

      update(delta: number, canvas: HTMLCanvasElement, mouse: { x: number; y: number; radius: number }, mouseRadiusSq: number, isInteracting: boolean) {
        this.phase += this.speed * (delta / 16);
        this.points = [];

        const step = isMobile ? 15 : 10;
        for (let y = 0; y <= canvas.height; y += step) {
          let waveOffset = this.amp * Math.sin(y * this.freq + this.phase);
          let x = this.baseX + waveOffset;

          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < mouseRadiusSq && isInteracting) {
            const dist = Math.sqrt(distSq) || 1;
            const force = (1 - (dist / mouse.radius)) ** 2 * mouse.radius * 0.2 * (isMobile ? 0.8 : 1);
            const angle = Math.atan2(dy, dx);
            x += Math.cos(angle) * force;
          }
          this.points.push({ x, y });
        }
      }

      draw(bufferCtx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        if (this.points.length < 2) return;

        bufferCtx.beginPath();
        bufferCtx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 0; i < this.points.length - 1; i++) {
          const p1 = this.points[i];
          const p2 = this.points[i + 1];
          const controlX = (p1.x + p2.x) / 2;
          const controlY = p1.y;
          bufferCtx.quadraticCurveTo(controlX, controlY, p2.x, p2.y);
        }

        bufferCtx.strokeStyle = this.color;
        bufferCtx.lineWidth = isMobile ? 0.5 : 1;
        bufferCtx.stroke();
      }
    }

    const createWaves = (canvas: HTMLCanvasElement) => {
      const density = isMobile ? 25 : 35;
      const spacing = canvas.width / density;
      waves = [];
      for (let i = 0; i < density; i++) {
        const baseX = i * spacing + (Math.random() * spacing * 0.5);
        waves.push(new WaveLine(baseX, canvas));
      }
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
      mouse.radius = 350;
      mouseRadiusSq = mouse.radius * mouse.radius;
      mouse.x = targetMouse.x;
      mouse.y = targetMouse.y;
    };

    const handleTouchEnd = () => {
      resetTimer = setTimeout(() => {
        isInteracting = false;
        targetMouse.x = -300;
        targetMouse.y = -300;
        mouse.radius = 300;
        mouseRadiusSq = mouse.radius * mouse.radius;
      }, 1500);
    };

    const handleTouchCancel = () => {
      handleTouchEnd();
    };

    const animate = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(animate);

      try {
        const delta = timestamp - lastFrameTime;
        if (delta < frameInterval) {
          return;
        }
        lastFrameTime = timestamp;
        avgFrameTime = avgFrameTime * 0.9 + delta * 0.1;

        if (avgFrameTime > frameInterval * 1.5 && isMobile) {
          frameInterval = Math.min(1000 / 20, frameInterval + 1);
        }

        if (isScrolling) {
          return; // Skip drawing during scroll for fluency
        }

        const lerpFactor = isMobile ? 0.3 : 0.5;
        mouse.x = mouse.x * (1 - lerpFactor) + targetMouse.x * lerpFactor;
        mouse.y = mouse.y * (1 - lerpFactor) + targetMouse.y * lerpFactor;

        bufferCtx.clearRect(0, 0, canvas.width, canvas.height);

        if (!isMobile) {
          bufferCtx.shadowColor = 'rgba(173, 216, 230, 0.2)';
          bufferCtx.shadowBlur = 5;
        } else {
          bufferCtx.shadowColor = 'transparent';
          bufferCtx.shadowBlur = 0;
        }

        waves.forEach(wave => {
          wave.update(delta, canvas, mouse, mouseRadiusSq, isInteracting);
          wave.draw(bufferCtx, canvas);
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bufferCanvas, 0, 0);

      } catch (error) {
        console.error('Animation error:', error);
      }
    };

    resizeCanvas();
    animationFrameId = requestAnimationFrame(animate);

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

    const handleScroll = () => {
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

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
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      if (resetTimer) clearTimeout(resetTimer);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',
        height: '100vh',  // Added to ensure the container has height
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          opacity: 0.8,
          zIndex: 0,
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </section>
  );
}