import React, { useRef, useEffect } from 'react';

type GoldenSquaresBackgroundProps = {
  children: React.ReactNode;
};

class Square {
  size: number;
  percentX: number;
  percentY: number;
  baseX: number = 0;
  baseY: number = 0;
  duration: number;
  delay: number;
  startTime: number;
  translateX: number = 0;
  translateY: number = 0;
  rotation: number = 0;
  scale: number = 1;

  constructor(size: number, percentX: number, percentY: number, duration: number, delay: number) {
    this.size = size;
    this.percentX = percentX;
    this.percentY = percentY;
    this.duration = duration;
    this.delay = delay;
    this.startTime = performance.now() / 1000 + delay;
  }

  update(time: number) {
    const elapsed = (time - this.startTime) % this.duration;
    const progress = elapsed / this.duration;

    const keyTimes = [0, 0.25, 0.5, 0.75, 1];
    const xValues = [0, 150, 75, -75, 0];
    const yValues = [0, -120, -180, -60, 0];
    const rotateValues = [0, 45, 90, 135, 180];
    const scaleValues = [1, 1.1, 0.9, 1.05, 1];

    let segment = 0;
    for (let i = 1; i < keyTimes.length; i++) {
      if (progress <= keyTimes[i]) {
        segment = i - 1;
        break;
      }
    }

    const segStart = keyTimes[segment];
    const segEnd = keyTimes[segment + 1];
    const segProgress = (progress - segStart) / (segEnd - segStart);

    // easeInOut quadratic
    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const eased = easeInOut(segProgress);

    this.translateX = xValues[segment] + eased * (xValues[segment + 1] - xValues[segment]);
    this.translateY = yValues[segment] + eased * (yValues[segment + 1] - yValues[segment]);
    this.rotation = rotateValues[segment] + eased * (rotateValues[segment + 1] - rotateValues[segment]);
    this.scale = scaleValues[segment] + eased * (scaleValues[segment + 1] - scaleValues[segment]);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.baseX + this.translateX, this.baseY + this.translateY);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(this.scale, this.scale);

    const halfSize = this.size / 2;
    const gradient = ctx.createLinearGradient(-halfSize, -halfSize, halfSize, halfSize);
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(1, '#F4E8C1');

    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.globalAlpha = 0.2;

    const radius = 2;
    ctx.beginPath();
    ctx.moveTo(-halfSize + radius, -halfSize);
    ctx.lineTo(halfSize - radius, -halfSize);
    ctx.quadraticCurveTo(halfSize, -halfSize, halfSize, -halfSize + radius);
    ctx.lineTo(halfSize, halfSize - radius);
    ctx.quadraticCurveTo(halfSize, halfSize, halfSize - radius, halfSize);
    ctx.lineTo(-halfSize + radius, halfSize);
    ctx.quadraticCurveTo(-halfSize, halfSize, -halfSize, halfSize - radius);
    ctx.lineTo(-halfSize, -halfSize + radius);
    ctx.quadraticCurveTo(-halfSize, -halfSize, -halfSize + radius, -halfSize);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

export function GoldenSquaresBackground({ children }: GoldenSquaresBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let lastResize = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const squareData = [
      // Top section
      { size: 12, x: 5, y: 10, duration: 8, delay: 0 },
      { size: 8, x: 25, y: 15, duration: 12, delay: 2 },
      { size: 16, x: 45, y: 8, duration: 10, delay: 1 },
      { size: 10, x: 65, y: 20, duration: 14, delay: 3 },
      { size: 14, x: 85, y: 12, duration: 9, delay: 0.5 },
      { size: 6, x: 95, y: 18, duration: 11, delay: 4 },
     
      // Middle section
      { size: 18, x: 10, y: 35, duration: 13, delay: 2.5 },
      { size: 9, x: 30, y: 45, duration: 15, delay: 1.5 },
      { size: 15, x: 50, y: 40, duration: 11, delay: 3.5 },
      { size: 7, x: 70, y: 50, duration: 9, delay: 1 },
      { size: 13, x: 90, y: 42, duration: 16, delay: 2 },
     
      // Lower middle section
      { size: 11, x: 15, y: 65, duration: 10, delay: 4.5 },
      { size: 20, x: 35, y: 70, duration: 14, delay: 0.8 },
      { size: 8, x: 55, y: 68, duration: 12, delay: 3.2 },
      { size: 16, x: 75, y: 72, duration: 8, delay: 1.8 },
     
      // Bottom section
      { size: 14, x: 8, y: 85, duration: 13, delay: 2.8 },
      { size: 10, x: 28, y: 90, duration: 11, delay: 4.2 },
      { size: 12, x: 48, y: 88, duration: 15, delay: 1.2 },
      { size: 17, x: 68, y: 92, duration: 9, delay: 3.8 },
      { size: 9, x: 88, y: 87, duration: 12, delay: 0.3 },
     
      // Additional scattered elements
      { size: 5, x: 20, y: 25, duration: 18, delay: 5 },
      { size: 22, x: 60, y: 30, duration: 7, delay: 2.3 },
      { size: 6, x: 40, y: 60, duration: 14, delay: 4.8 },
      { size: 19, x: 80, y: 55, duration: 10, delay: 1.7 },
      { size: 8, x: 12, y: 75, duration: 16, delay: 3.1 },

      // New additional elements for more floating squares
      { size: 7, x: 3, y: 5, duration: 11, delay: 1.2 },
      { size: 15, x: 18, y: 22, duration: 9, delay: 3.4 },
      { size: 11, x: 32, y: 28, duration: 13, delay: 0.7 },
      { size: 9, x: 42, y: 52, duration: 15, delay: 2.1 },
      { size: 13, x: 58, y: 48, duration: 10, delay: 4.3 },
      { size: 6, x: 72, y: 62, duration: 12, delay: 1.5 },
      { size: 18, x: 82, y: 78, duration: 14, delay: 3.7 },
      { size: 10, x: 92, y: 95, duration: 8, delay: 0.9 },
      { size: 14, x: 7, y: 48, duration: 16, delay: 2.6 },
      { size: 8, x: 22, y: 82, duration: 11, delay: 4.1 },
      { size: 16, x: 38, y: 12, duration: 13, delay: 1.8 },
      { size: 12, x: 52, y: 32, duration: 9, delay: 3.3 },
      { size: 20, x: 68, y: 58, duration: 15, delay: 0.4 },
      { size: 5, x: 78, y: 88, duration: 10, delay: 2.9 },
      { size: 17, x: 96, y: 25, duration: 12, delay: 4.4 },
      { size: 9, x: 4, y: 92, duration: 14, delay: 1.1 },
      { size: 11, x: 14, y: 38, duration: 8, delay: 3.6 },
      { size: 19, x: 28, y: 68, duration: 16, delay: 0.2 },
      { size: 7, x: 44, y: 98, duration: 11, delay: 2.4 },
      { size: 15, x: 62, y: 8, duration: 13, delay: 4.6 },
    ];

    const squareObjects: Square[] = squareData.map(
      (data) => new Square(data.size, data.x, data.y, data.duration, data.delay)
    );

    const resizeCanvas = () => {
      const now = Date.now();
      if (now - lastResize < 100) return; // Debounce resize
      lastResize = now;

      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        squareObjects.forEach((s) => {
          s.baseX = (s.percentX / 100) * canvas.width;
          s.baseY = (s.percentY / 100) * canvas.height;
        });
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = performance.now() / 1000;
      squareObjects.forEach((square) => {
        square.update(time);
        square.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}