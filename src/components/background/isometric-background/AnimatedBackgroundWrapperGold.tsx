import React, { useRef, useEffect, ReactNode } from 'react';

// Define the structure for a grid point (hexagon vertex)
interface GridPoint {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
}

// Define the props for the wrapper component
interface AnimatedBackgroundWrapperProps {
  children: ReactNode;
  className?: string;
}

// Define colors at a scope accessible by the component
const lightGold = '#d4bf86ff';
const darkGold = '#d1c67bff';
const colors = [lightGold, darkGold];

export const AnimatedBackgroundWrapper: React.FC<AnimatedBackgroundWrapperProps> = ({ children, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  // ADDED: A ref to track if the initial animation has already run
  const isInitialized = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- CONFIGURATION ---
    const hexSize = 50; // Radius of the hexagons
    const easingFactor = 0.04; // Controls animation speed (smaller is slower)
    
    // --- DATA STRUCTURES ---
    let points: GridPoint[] = []; 
    let hexagons: GridPoint[][] = [];

    // Mouse position tracker
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 200 // Interaction radius
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    // Function to set canvas size and initialize the grid
    const initialize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      points = [];
      hexagons = [];
      const pointMap = new Map<string, GridPoint>();

      const hexHeight = Math.sqrt(3) * hexSize;
      const hexWidth = 2 * hexSize;
      const horizSpacing = hexWidth * 3 / 4;
      const vertSpacing = hexHeight;

      const cols = Math.ceil(canvas.width / horizSpacing) + 2;
      const rows = Math.ceil(canvas.height / vertSpacing) + 2;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const x = col * horizSpacing;
          const y = row * vertSpacing + (col % 2 === 0 ? 0 : vertSpacing / 2);
          
          const centerPoint = { x, y };
          const hexPoints: GridPoint[] = [];

          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 180) * (60 * i - 30);
            const px = centerPoint.x + hexSize * Math.cos(angle);
            const py = centerPoint.y + hexSize * Math.sin(angle);
            const key = `${Math.round(px)},${Math.round(py)}`;

            if (!pointMap.has(key)) {
              // --- CHANGED: MODIFIED LOGIC FOR ONE-TIME ANIMATION ---
              const startX = !isInitialized.current
                ? (px < canvas.width / 2 ? px - canvas.width : px + canvas.width)
                : px;

              const newPoint: GridPoint = {
                x: startX, // Use the conditional starting position
                y: py,
                originX: px,
                originY: py,
                color: colors[Math.floor(Math.random() * colors.length)]
              };
              pointMap.set(key, newPoint);
              points.push(newPoint);
            }
            hexPoints.push(pointMap.get(key)!);
          }
          
          hexagons.push(hexPoints);
        }
      }

      // --- ADDED: Set the flag to true after the first initialization ---
      if (!isInitialized.current) {
        isInitialized.current = true;
      }
    };

    let frameCount = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      points.forEach(p => {
        let targetX = p.originX;
        let targetY = p.originY + Math.sin(frameCount * 0.015 + p.originX * 0.01) * 10;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            targetX -= Math.cos(angle) * force * 50;
            targetY -= Math.sin(angle) * force * 50;
          }
        }
        
        p.x += (targetX - p.x) * easingFactor;
        p.y += (targetY - p.y) * easingFactor;
      });

      ctx.lineWidth = 1;
      hexagons.forEach(hex => {
        ctx.beginPath();
        ctx.moveTo(hex[0].x, hex[0].y);
        for (let i = 1; i < 6; i++) {
          ctx.lineTo(hex[i].x, hex[i].y);
        }
        ctx.closePath();
        
        ctx.strokeStyle = hex[0].color;
        ctx.stroke();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    initialize();
    animate();

    const handleResize = () => {
      initialize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', background: '#FFFFFF', width: '100%', height: '100%' }} className={className}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          opacity: 0.3,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
};