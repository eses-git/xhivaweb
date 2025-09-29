import React, { useRef, useEffect, ReactNode } from 'react';

// Define the structure for a grid point
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
const lightBlue = '#6c9dc8ff';
const darkBlue = '#2D5F9B';
const colors = [lightBlue, darkBlue];

export const AnimatedBackgroundWrapper: React.FC<AnimatedBackgroundWrapperProps> = ({ children, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- CONFIGURATION ---
    const hexSize = 50; // Increased size (radius) of the hexagons for bigger shapes
    const pointRadius = 4; // Increased radius of the dots at the vertices for better visibility
    // --- ANIMATION SPEED CONTROL ---
    // A smaller value here makes the slide-in and other movements slower and smoother.
    const easingFactor = 0.04; 


    let points: GridPoint[] = [];
    let connections: { p1: GridPoint, p2: GridPoint }[] = [];

    // Mouse position tracker
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 200 // Increased interaction radius for bigger mouse effect area
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
      connections = [];
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

          // Create the 6 vertices for each hexagon
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 180) * (60 * i - 30);
            const px = centerPoint.x + hexSize * Math.cos(angle);
            const py = centerPoint.y + hexSize * Math.sin(angle);
            const key = `${Math.round(px)},${Math.round(py)}`;

            if (!pointMap.has(key)) {
              // --- MODIFICATION FOR SLIDE-IN EFFECT ---
              // Determine if the point belongs to the left or right side of the screen
              const isLeft = px < canvas.width / 2;
              // Set the initial x-position off-screen to the left or right
              const initialX = isLeft ? px - canvas.width : px + canvas.width;

              const newPoint: GridPoint = {
                x: initialX, // Start off-screen
                y: py,       // Keep original y position
                originX: px, // Set the final destination X
                originY: py, // Set the final destination Y
                color: colors[Math.floor(Math.random() * colors.length)]
              };
              pointMap.set(key, newPoint);
              points.push(newPoint);
            }
            hexPoints.push(pointMap.get(key)!);
          }
          
          // Create connections for the hexagon edges
          for (let i = 0; i < 6; i++) {
            connections.push({ p1: hexPoints[i], p2: hexPoints[(i + 1) % 6] });
          }
        }
      }
    };

    let frameCount = 0;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // --- SPECTACULAR CONNECTION EFFECT ---
      // Draw lines between connected points, making them fade in as they get closer.
      ctx.lineWidth = 0.5;
      connections.forEach(conn => {
        const dx = conn.p1.x - conn.p2.x;
        const dy = conn.p1.y - conn.p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only draw lines when points are reasonably close to their final connected distance
        if (distance < hexSize * 2) {
            // As points get closer to their ideal distance (hexSize), the line becomes more opaque
            const opacity = Math.max(0, 1 - (distance - hexSize) / hexSize);

            if (opacity > 0) {
                ctx.beginPath();
                ctx.moveTo(conn.p1.x, conn.p1.y);
                ctx.lineTo(conn.p2.x, conn.p2.y);
                const avgColor = conn.p1.color === conn.p2.color ? conn.p1.color : lightBlue;
                
                // Convert hex color to rgba to apply the dynamic opacity
                const r = parseInt(avgColor.slice(1, 3), 16);
                const g = parseInt(avgColor.slice(3, 5), 16);
                const b = parseInt(avgColor.slice(5, 7), 16);
                
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                ctx.stroke();
            }
        }
      });

      // Update and draw each point
      points.forEach(p => {
        let targetX = p.originX;
        let targetY = p.originY + Math.sin(frameCount * 0.015 + p.originX * 0.01) * 10; // Increased waving amplitude for bigger motion

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            targetX -= Math.cos(angle) * force * 50; // Increased displacement strength for stronger interactions
            targetY -= Math.sin(angle) * force * 50; // Increased displacement strength for stronger interactions
          }
        }
        
        // Easing will handle both the initial slide-in and the subsequent animations
        p.x += (targetX - p.x) * easingFactor;
        p.y += (targetY - p.y) * easingFactor;

        // Draw the point
        ctx.beginPath();
        ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.fill();
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
          opacity: 0.3, // Added opacity to make the background lighter and blend better with content
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

