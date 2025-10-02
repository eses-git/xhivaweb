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
  // ADDED: A ref to track if the initial animation has already run
  const isInitialized = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- CONFIGURATION ---
    const pointRadius = 4;
    const easingFactor = 0.04; 
    let hexSize = 50; // NEW: Declare hexSize in outer scope (defaults to desktop value)

    let points: GridPoint[] = [];
    let connections: { p1: GridPoint, p2: GridPoint }[] = [];

    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 200
    };

    // NEW: Debounce function for resize
    function debounce(func: (...args: any[]) => void, delay: number) {
      let timeout: NodeJS.Timeout | null = null;
      return function(...args: any[]) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
      };
    }

    // MODIFIED: Handle mouse move (now on canvas parent for better containment)
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    // NEW: Handle touch move for mobile interaction
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.touches[0].clientX - rect.left;
        mouse.y = event.touches[0].clientY - rect.top;
      }
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // NEW: Handle touch end/cancel
    const handleTouchEnd = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // Attach to window for mouse, but add touch to canvas parent
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });
    canvas.parentElement?.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.parentElement?.addEventListener('touchend', handleTouchEnd, { passive: true });
    canvas.parentElement?.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    const initialize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      points = [];
      connections = [];
      const pointMap = new Map<string, GridPoint>();
      // NEW: Dynamic hexSize based on screen width for fewer points on mobile (update the outer hexSize)
      hexSize = window.innerWidth < 768 ? 100 : 50; // Larger on mobile = fewer hexes/points for perf
      const hexHeight = Math.sqrt(3) * hexSize;
      const hexWidth = 2 * hexSize;
      const horizSpacing = hexWidth * 3 / 4;
      const vertSpacing = hexHeight;

      const cols = Math.ceil(canvas.width / horizSpacing) + 2;
      const rows = Math.ceil(canvas.height / vertSpacing) + 2;

      // NEW: Set to track unique connections (deduplicate to avoid redundant draws)
      const connectionSet = new Set<string>();

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
              // The slide-in effect only happens if isInitialized.current is false.
              // For all subsequent resizes, points are created in their final position.
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
          
          for (let i = 0; i < 6; i++) {
            const p1 = hexPoints[i];
            const p2 = hexPoints[(i + 1) % 6];
            // NEW: Unique key for connection (sort by reference or coords to dedupe)
            const connKey = [p1, p2].sort((a, b) => a.originX - b.originX || a.originY - b.originY).map(p => `${p.originX},${p.originY}`).join('-');
            if (!connectionSet.has(connKey)) {
              connectionSet.add(connKey);
              connections.push({ p1, p2 });
            }
          }
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

      ctx.lineWidth = 0.5;
      connections.forEach(conn => {
        const dx = conn.p1.x - conn.p2.x;
        const dy = conn.p1.y - conn.p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < hexSize * 2) { // FIXED: hexSize is now in outer scope
            const opacity = Math.max(0, 1 - (distance - hexSize) / hexSize);
            if (opacity > 0) {
                ctx.beginPath();
                ctx.moveTo(conn.p1.x, conn.p1.y);
                ctx.lineTo(conn.p2.x, conn.p2.y);
                const avgColor = conn.p1.color === conn.p2.color ? conn.p1.color : lightBlue;
                
                const r = parseInt(avgColor.slice(1, 3), 16);
                const g = parseInt(avgColor.slice(3, 5), 16);
                const b = parseInt(avgColor.slice(5, 7), 16);
                
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                ctx.stroke();
            }
        }
      });

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

        ctx.beginPath();
        ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    initialize();
    animate();

    // MODIFIED: Debounced resize with size change check
    const handleResize = () => {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
      if (oldWidth !== canvas.width || oldHeight !== canvas.height) {
        initialize();
      }
    };
    const debouncedResize = debounce(handleResize, 200);
    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      if (canvas.parentElement) {
        canvas.parentElement.removeEventListener('touchmove', handleTouchMove);
        canvas.parentElement.removeEventListener('touchend', handleTouchEnd);
        canvas.parentElement.removeEventListener('touchcancel', handleTouchEnd);
      }
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