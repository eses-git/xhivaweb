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
    const cellSize = 90;
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
      originalBaseX: number;
      originalBaseY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      sublattice: string;

      constructor(x: number, y: number, z: number, color: string, sublattice: string) {
        this.z = z;
        this.x = x;
        this.y = y;
        this.originalBaseX = x;
        this.originalBaseY = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() * 0.5 - 0.3) * this.z;
        this.vy = (Math.random() * 0.5 - 0.3) * this.z;
        this.size = (Math.random() * 2 + 1) * this.z;
        this.color = color;
        this.sublattice = sublattice;
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
      const width = canvasElement.width;
      const height = canvasElement.height;
      const area = width * height;
      let particleCount = Math.min(900, Math.floor(area / 3000));
      if (particleCount === 0) return;

      const aspect = width / height;
      const hexRatio = Math.sqrt(3) / 2;
      const ratio = aspect * hexRatio;
      let numRows = Math.round(Math.sqrt(particleCount / ratio));
      let numCols = Math.round(particleCount / numRows);
      particleCount = numRows * numCols; // Adjust to exact grid size

      const effectiveCols = numCols - 0.5;
      const hexSpacing = width / effectiveCols;
      const rowSpacing = hexSpacing * Math.sqrt(3) / 2;

      const gridHeight = (numRows - 1) * rowSpacing;
      const startY = (height - gridHeight) / 2;

      const startX = 0;

      particles = [];

      for (let row = 0; row < numRows; row++) {
        const isOddRow = row % 2 === 1;
        const xOffset = isOddRow ? hexSpacing / 2 : 0;
        const startWithA = !isOddRow;
        const y = startY + row * rowSpacing;
        for (let col = 0; col < numCols; col++) {
          const x = startX + col * hexSpacing + xOffset;
          const z = Math.random() * 0.4 + 0.3;
          const color = Math.random() > 0.5 ? '#B88A4E' : '#CACDCE';
          const sublattice = startWithA ? (col % 2 === 0 ? 'A' : 'B') : (col % 2 === 0 ? 'B' : 'A');
          particles.push(new Particle(x, y, z, color, sublattice));
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
                particle.vx -= directionX; // Attract for neural connection effect
                particle.vy -= directionY;
              }
            }
          }
        }
      }
    };

    const handleConnections = () => {
      bufferCtx.shadowColor = '#d1bd49ff';
      bufferCtx.shadowBlur = 0;
      bufferCtx.lineWidth = 0.3;

      const hexSpacing = particles.length > 0 ? Math.sqrt((canvas.width * canvas.height / particles.length) * 2 / Math.sqrt(3)) : 120;
      const connectDistanceSq = (hexSpacing * 1.01) ** 2;

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
        for (let i = -1; i <= 1 && connections < 10; i++) {
          for (let j = -1; j <= 1 && connections < 10; j++) {
            const key = `${gridX + i},${gridY + j}`;
            if (grid.has(key)) {
              for (const p2 of grid.get(key)!) {
                if (p1 === p2 || connections >= 10) continue;
                if (p1.sublattice === p2.sublattice) continue;
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

      const time = performance.now() * 0.0002; // Very slow waving

      bufferCtx.shadowColor = '#B88A4E';
      bufferCtx.shadowBlur = 12;
      particles.forEach(particle => {
        const waveZ = Math.sin(0.05 * particle.originalBaseX + time) * 2 + Math.sin(0.03 * particle.originalBaseY + time * 0.7);
        particle.baseY = particle.originalBaseY + waveZ * 2; // Gentle waving in y, reduced amplitude

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