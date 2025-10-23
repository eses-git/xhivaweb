// interactive-network-small.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';

// --- Types for the Neural Network Animation ---
interface Node {
  id: string;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  baseX: number; // original x
  baseY: number; // original y
  color: string;
}

interface Edge {
  source: string;
  target: string;
}

// --- Neural Network Background Component (Internal) ---
const NeuralNetwork: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  // --- Screen-size detection logic ---
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Responsive parameters ---
  const viewWidth = isMobile ? 400 : 1000;
  const viewHeight = isMobile ? 1000 : 400;
  const nodeRadius = isMobile ? 10 : 8; // Bigger on mobile as requested

  const initialNodes = useMemo<Node[]>(() => {
    const desktopNodes: Omit<Node, 'vx' | 'vy'>[] = [
      // ... (all your node data remains unchanged) ...
      { id: 'l1', x: 50, y: 150, color: '#2b5797', baseX: 50, baseY: 150 },
      { id: 'l2', x: 100, y: 50, color: '#2b5797', baseX: 100, baseY: 50 },
      { id: 'l3', x: 100, y: 250, color: '#2b5797', baseX: 100, baseY: 250 },
      { id: 'l4', x: 150, y: 150, color: '#6a8ec8', baseX: 150, baseY: 150 },
      { id: 'l5', x: 150, y: 300, color: '#6a8ec8', baseX: 150, baseY: 300 },
      { id: 'l6', x: 80, y: 320, color: '#2b5797', baseX: 80, baseY: 320 },
      { id: 'l7', x: 30, y: 80, color: '#6a8ec8', baseX: 30, baseY: 80 },
      { id: 'cl1', x: 200, y: 100, color: '#a9bce8', baseX: 200, baseY: 100 },
      { id: 'cl2', x: 200, y: 200, color: '#a9bce8', baseX: 200, baseY: 200 },
      { id: 'cl3', x: 250, y: 150, color: '#d0d9f0', baseX: 250, baseY: 150 },
      { id: 'cl4', x: 300, y: 50, color: '#d0d9f0', baseX: 300, baseY: 50 },
      { id: 'cl5', x: 220, y: 280, color: '#a9bce8', baseX: 220, baseY: 280 },
      { id: 'c1', x: 350, y: 200, color: '#c7c7c7', baseX: 350, baseY: 200 },
      { id: 'c2', x: 400, y: 100, color: '#c7c7c7', baseX: 400, baseY: 100 },
      { id: 'c3', x: 450, y: 150, color: '#b2b2b2', baseX: 450, baseY: 150 },
      { id: 'c4', x: 500, y: 250, color: '#b2b2b2', baseX: 500, baseY: 250 },
      { id: 'c5', x: 480, y: 50, color: '#b2b2b2', baseX: 480, baseY: 50 },
      { id: 'c6', x: 420, y: 280, color: '#c7c7c7', baseX: 420, baseY: 280 },
      { id: 'cr1', x: 550, y: 100, color: '#e0e0a0', baseX: 550, baseY: 100 },
      { id: 'cr2', x: 600, y: 200, color: '#e0e0a0', baseX: 600, baseY: 200 },
      { id: 'cr3', x: 650, y: 150, color: '#e0e0a0', baseX: 650, baseY: 150 },
      { id: 'cr4', x: 580, y: 30, color: '#e0e0a0', baseX: 580, baseY: 30 },
      { id: 'r1', x: 700, y: 50, color: '#e8d973', baseX: 700, baseY: 50 },
      { id: 'r2', x: 700, y: 250, color: '#e8d973', baseX: 700, baseY: 250 },
      { id: 'r3', x: 750, y: 150, color: '#e8d973', baseX: 750, baseY: 150 },
      { id: 'r4', x: 800, y: 300, color: '#e8d973', baseX: 800, baseY: 300 },
      { id: 'r5', x: 850, y: 100, color: '#e8d973', baseX: 850, baseY: 100 },
      { id: 'r6', x: 900, y: 200, color: '#e8d973', baseX: 900, baseY: 200 },
      { id: 'r7', x: 950, y: 50, color: '#e8d973', baseX: 950, baseY: 50 },
      { id: 'r8', x: 850, y: 350, color: '#e8d973', baseX: 850, baseY: 350 },
      { id: 'r9', x: 930, y: 120, color: '#e8d973', baseX: 930, baseY: 120 },
    ];
    
    let transformedNodes;
    if (isMobile) {
      transformedNodes = desktopNodes.map(node => ({
        ...node,
        x: node.y + 20,
        y: node.x,
        baseX: node.y + 20,
        baseY: node.x,
      }));
    } else {
      transformedNodes = desktopNodes;
    }

    return transformedNodes.map(node => ({
        ...node,
        vx: 0,
        vy: 0,
    }));
  }, [isMobile]);

  const [currentNodes, setCurrentNodes] = useState<Node[]>(initialNodes);
  const [dynamicEdges, setDynamicEdges] = useState<Edge[]>([]);

  const nodesRef = useRef<Node[]>(JSON.parse(JSON.stringify(initialNodes)));
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const frameCountRef = useRef(0);

  const nodesById = useMemo(() => {
    const map = new Map<string, Node>();
    currentNodes.forEach(node => map.set(node.id, node));
    return map;
  }, [currentNodes]);
  
  useEffect(() => {
      nodesRef.current = JSON.parse(JSON.stringify(initialNodes));
      setCurrentNodes(initialNodes);
  }, [initialNodes]);

  useEffect(() => {
    const connectDistance = isMobile ? 150 : 120; // Slightly larger on mobile for better connectivity in tall layout
    const connectDistanceSq = connectDistance * connectDistance;

    const newEdges: Edge[] = [];
    for (let i = 0; i < currentNodes.length; i++) {
      for (let j = i + 1; j < currentNodes.length; j++) {
        const p1 = currentNodes[i];
        const p2 = currentNodes[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < connectDistanceSq) {
          newEdges.push({ source: p1.id, target: p2.id });
        }
      }
    }
    setDynamicEdges(newEdges);
  }, [currentNodes, isMobile]);

  // --- MODIFICATION: Added setTimeout to delay animation ---
  useEffect(() => {
    // Accessibility: Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      // Skip animation; could set static positions here if desired
      return;
    }

    // 1. Start the timer
    const animationTimer = setTimeout(() => {
      let animationFrameId: number;
      let time = 0;
      const updateInterval = isMobile ? 4 : 2; // Throttle state updates: every 4 frames on mobile (~15 FPS effective), every 2 on desktop (~30 FPS)
      frameCountRef.current = 0;

      const animate = () => {
        time += 0.01;
        const { x: mouseX, y: mouseY } = mouseRef.current;
        const repelRadius = 100;
        const repelStrength = isMobile ? 3 : 4; // Slightly lower strength on mobile for smoother performance
        const damping = 0.99;
        const ambientStrength = isMobile ? 0.001 : 0.000; // Lower ambient on mobile to reduce computation

        const updatedNodes = nodesRef.current.map(node => {
          node.vx += (Math.sin(time + node.baseY) * ambientStrength);
          node.vy += (Math.cos(time + node.baseX) * ambientStrength);
          const dxMouse = node.x - mouseX;
          const dyMouse = node.y - mouseY;
          const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
          if (distMouseSq < repelRadius * repelRadius) {
            const distMouse = Math.sqrt(distMouseSq);
            const force = (1 - distMouse / repelRadius) * repelStrength;
            node.vx += (dxMouse / distMouse) * force;
            node.vy += (dyMouse / distMouse) * force;
          }
          // Added spring force for recentering
          const springFactor = 0.005;
          node.vx += (node.baseX - node.x) * springFactor;
          node.vy += (node.baseY - node.y) * springFactor;
          node.vx *= damping;
          node.vy *= damping;
          node.x += node.vx;
          node.y += node.vy;
          
          const radius = nodeRadius; 
          if (node.x - radius < 0) { node.x = radius; node.vx *= -1; }
          else if (node.x + radius > viewWidth) { node.x = viewWidth - radius; node.vx *= -1; }
          if (node.y - radius < 0) { node.y = radius; node.vy *= -1; }
          else if (node.y + radius > viewHeight) { node.y = viewHeight - radius; node.vy *= -1; }
          return node;
        });
        nodesRef.current = updatedNodes;

        frameCountRef.current++;
        if (frameCountRef.current % updateInterval === 0) {
          setCurrentNodes([...updatedNodes]); // Update React state less frequently for better perf
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      // 2. All this logic now runs *inside* the timer
      animationFrameId = requestAnimationFrame(animate);

      const updatePointerPosition = (event: MouseEvent | TouchEvent) => {
        if (!svgRef.current) return;
        const svgPoint = svgRef.current.createSVGPoint();
        let clientX, clientY;
        if ('touches' in event) {
          const touch = event.touches[0];
          clientX = touch.clientX;
          clientY = touch.clientY;
        } else {
          clientX = event.clientX;
          clientY = event.clientY;
        }
        svgPoint.x = clientX;
        svgPoint.y = clientY;
        
        const inverseCTM = svgRef.current.getScreenCTM()?.inverse();
        if (inverseCTM) {
            const pointInSVGSpace = svgPoint.matrixTransform(inverseCTM);
            mouseRef.current = { x: pointInSVGSpace.x, y: pointInSVGSpace.y };
        }
      };

      const handlePointerLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

      if (isMobile) {
        window.addEventListener('touchstart', updatePointerPosition, { passive: true });
        window.addEventListener('touchmove', updatePointerPosition, { passive: true });
        window.addEventListener('touchend', handlePointerLeave, { passive: true });
        window.addEventListener('touchcancel', handlePointerLeave, { passive: true });
      } else {
        window.addEventListener('mousemove', updatePointerPosition as EventListener);
        window.addEventListener('mouseleave', handlePointerLeave);
      }

      // 3. The cleanup for the animation must be returned *by the timer*
      return () => {
        cancelAnimationFrame(animationFrameId);
        if (isMobile) {
          window.removeEventListener('touchstart', updatePointerPosition);
          window.removeEventListener('touchmove', updatePointerPosition);
          window.removeEventListener('touchend', handlePointerLeave);
          window.removeEventListener('touchcancel', handlePointerLeave);
        } else {
          window.removeEventListener('mousemove', updatePointerPosition as EventListener);
          window.removeEventListener('mouseleave', handlePointerLeave);
        }
      };
    }, isMobile ? 1200 : 500); // Longer delay on mobile for better initial load

    // 4. The main useEffect cleanup just clears the timer
    return () => {
      clearTimeout(animationTimer);
    };
  }, [viewWidth, viewHeight, nodeRadius, isMobile]); // Added isMobile to dependencies

  return (
    <svg 
      ref={svgRef} 
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      style={{ width: '100%', height: '100%', cursor: 'pointer', display: 'block' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.2" />
        </filter>
      </defs>
      <g>
        {dynamicEdges.map((edge, i) => {
          const source = nodesById.get(edge.source);
          const target = nodesById.get(edge.target);
          if (!source || !target) return null;
          return <line key={`edge-${i}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#d0d0d0" strokeWidth={1} strokeOpacity={isMobile ? 0.4 : 0.6} />;
        })}
        {currentNodes.map(node => (
          <circle key={node.id} cx={node.x} cy={node.y} r={nodeRadius} fill={node.color} style={isMobile ? {} : { filter: 'url(#shadow)' }} /> // Skip shadow on mobile for perf
        ))}
      </g>
    </svg>
  );
};

// --- MODIFICATION: Wrapper component simplified to be a background element ---
// 1. Removed 'children' prop
const NeuralConnections: React.FC = () => {
  // 2. Changed styles to be absolute positioning
  const sectionStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0, // Replaces top/left/width/height
    zIndex: 0,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.5,
  };

  return (
    <section style={sectionStyle}>
      <div style={backgroundStyle}>
        <NeuralNetwork />
      </div>
      {/* 3. Removed the children/content div */}
    </section>
  );
};

export default NeuralConnections;