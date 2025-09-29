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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- CONFIGURATION ---
    const hexSize = 50; // Radius of the hexagons
    const easingFactor = 0.04; // Controls animation speed (smaller is slower)
    
    // --- DATA STRUCTURES ---
    // A single list of all unique points (vertices)
    let points: GridPoint[] = []; 
    // A list of hexagons, where each hexagon is an array of its 6 vertex points
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

      // Reset data structures
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

          // Create or retrieve the 6 vertices for this hexagon
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 180) * (60 * i - 30);
            const px = centerPoint.x + hexSize * Math.cos(angle);
            const py = centerPoint.y + hexSize * Math.sin(angle);
            const key = `${Math.round(px)},${Math.round(py)}`;

            if (!pointMap.has(key)) {
              // --- SLIDE-IN EFFECT ---
              const isLeft = px < canvas.width / 2;
              const initialX = isLeft ? px - canvas.width : px + canvas.width;

              const newPoint: GridPoint = {
                x: initialX, // Start off-screen
                y: py,
                originX: px, // Final destination X
                originY: py, // Final destination Y
                color: colors[Math.floor(Math.random() * colors.length)]
              };
              pointMap.set(key, newPoint);
              points.push(newPoint);
            }
            hexPoints.push(pointMap.get(key)!);
          }
          
          // Store the completed hexagon (as an array of its 6 points)
          hexagons.push(hexPoints);
        }
      }
    };

    let frameCount = 0;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // 1. First, update the position of every single point
      points.forEach(p => {
        let targetX = p.originX;
        // Waving motion effect
        let targetY = p.originY + Math.sin(frameCount * 0.015 + p.originX * 0.01) * 10;

        // Mouse interaction effect
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
        
        // Ease the point towards its target position (handles slide-in, waving, and mouse effects)
        p.x += (targetX - p.x) * easingFactor;
        p.y += (targetY - p.y) * easingFactor;
      });

      // 2. Now, draw the solid hexagons using the updated point positions
      ctx.lineWidth = 1; // Set line width for the hexagons
      hexagons.forEach(hex => {
        ctx.beginPath();
        ctx.moveTo(hex[0].x, hex[0].y);
        for (let i = 1; i < 6; i++) {
          ctx.lineTo(hex[i].x, hex[i].y);
        }
        ctx.closePath();
        
        // Use the color of the first vertex for the entire hexagon's stroke
        ctx.strokeStyle = hex[0].color;
        ctx.stroke();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    initialize();
    animate();

    // Resize event listener
    const handleResize = () => {
      initialize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
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
          opacity: 0.3, // Opacity for the background
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
};