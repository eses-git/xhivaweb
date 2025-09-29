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

    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const bufferCanvas = bufferCanvasRef.current;
    const bufferCtx = bufferCanvas.getContext('2d')!;
    if (!bufferCtx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -300, y: -300, radius: 150 };
    const mouseRadiusSq = mouse.radius * mouse.radius;
    const cellSize = 60; // Reduced slightly to match denser grid cells
    let grid: Map<string, Particle[]> = new Map();
    let lastResize = 0;

    const resizeCanvas = () => {
      const now = Date.now();
      if (now - lastResize < 100) return; // Debounce resize
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

      constructor(x: number, y: number, z: number, color: string) {
        this.z = z;
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() * 0.5 - 0.3) * this.z;
        this.vy = (Math.random() * 0.5 - 0.3) * this.z;
        this.size = (Math.random() * 1 + 0.5) * this.z; // Reduced size variance for smaller, uniform dots
        this.color = color;
      }

      update(canvasElement: HTMLCanvasElement) {
        const springFactor = 0.001;
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
      // Increased density for more prominent hex structure
      const particleCount = Math.min(2000, Math.floor((canvasElement.width * canvasElement.height) / 1000));
      particles = [];

      // Hexagonal grid parameters
      const hexSpacing = 30; // Reduced for denser packing
      const rowOffset = hexSpacing * Math.sqrt(3) / 2;
      const cols = Math.ceil(canvasElement.width / hexSpacing) + 1; // Extra for full coverage
      const rows = Math.ceil(canvasElement.height / rowOffset) + 1; // Based on height for better fit

      let count = 0;
      for (let row = 0; row < rows && count < particleCount; row++) {
        const yBase = row * rowOffset;
        const isOffsetRow = row % 2 === 1;
        for (let col = 0; col < cols && count < particleCount; col++) {
          let x = (col + (isOffsetRow ? 0.5 : 0)) * hexSpacing;
          let y = yBase;

          // Apply subtler sinusoidal wave distortion
          const waveAmplitude = 10; // Reduced for less distortion
          const waveFrequency = 0.01; // Reduced for broader waves
          y += waveAmplitude * Math.sin(x * waveFrequency);

          // Clamp to canvas bounds
          if (x < 0 || x > canvasElement.width || y < 0 || y > canvasElement.height) continue;

          const z = Math.random() * 0.4 + 0.3;
          const color = Math.random() > 0.5 ? '#B88A4E' : '#CACDCE';
          particles.push(new Particle(x, y, z, color));
          count++;
        }
      }
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
                const forceMultiplier = 3;
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
      bufferCtx.shadowColor = '#d1bd49ff';
      bufferCtx.shadowBlur = 0;
      bufferCtx.lineWidth = 1; // Increased for bolder lines like in the example

      const connectDistanceSq = (30 * 1.05) ** 2; // Tighter threshold for exact nearest neighbors only
      grid = new Map();
      for (const p of particles) {
        const gridX = Math.floor(p.x / cellSize);
        const gridY = Math.floor(p.y / cellSize);
        const key = `${gridX},${gridY}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(p);
      }

      const gradient = bufferCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(184, 138, 78, 0.8)');
      gradient.addColorStop(1, 'rgba(212, 167, 106, 0.5)');

      bufferCtx.globalAlpha = 0.85;
      bufferCtx.beginPath();
      for (const p1 of particles) {
        const gridX = Math.floor(p1.x / cellSize);
        const gridY = Math.floor(p1.y / cellSize);
        let connections = 0;
        for (let i = -1; i <= 1 && connections < 7; i++) { // Limit to 6 max connections
          for (let j = -1; j <= 1 && connections < 7; j++) {
            const key = `${gridX + i},${gridY + j}`;
            if (grid.has(key)) {
              for (const p2 of grid.get(key)!) {
                if (p1 === p2 || connections >= 7) continue;
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distanceSq = dx * dx + dy * dy;
                if (distanceSq < connectDistanceSq && distanceSq > 0) { // Added >0 to avoid self
                  bufferCtx.moveTo(p1.x, p1.y);
                  bufferCtx.lineTo(p2.x, p2.y);
                  connections++;
                }
              }
            }
          }
        }
      }
      bufferCtx.strokeStyle = gradient;
      bufferCtx.stroke();
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const animate = () => {
      bufferCtx.clearRect(0, 0, canvas.width, canvas.height);

      bufferCtx.shadowColor = '#B88A4E';
      bufferCtx.shadowBlur = 12;
      particles.forEach(particle => {
        particle.update(canvas);
        particle.draw();
      });

      bufferCtx.globalAlpha = 1.0;
      bufferCtx.shadowBlur = 0;
      handleMouseInteraction();
      handleConnections();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bufferCanvas, 0, 0);

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, #040a14 0%, #0A1831 100%)` }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-80 z-0 canvas-custom"
        style={{ willChange: 'transform' }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}