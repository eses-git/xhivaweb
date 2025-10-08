import React, { useRef, useEffect, ReactNode } from 'react';

// Define the structure for the component's props
interface NeuralAnimationWrapperProps {
  children: ReactNode;
  className?: string;
}

// This is the reusable wrapper component for the neural animation.
export const NeuralAnimationWrapper: React.FC<NeuralAnimationWrapperProps> = ({ children, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        
        // Define the structure for a particle
        interface ParticleType {
          x: number;
          y: number;
          vx: number;
          vy: number;
          radius: number;
          update: (canvasWidth: number, canvasHeight: number, mouse: { x?: number, y?: number, radius: number }) => void;
          draw: (context: CanvasRenderingContext2D) => void;
        }

        // --- All the animation logic from the original component is placed here ---
        let particles: ParticleType[] = [];
        const maxDistance = 200;
        const particleColor = 'rgba(45, 95, 155,';
        
        const mouse = {
            x: undefined as number | undefined,
            y: undefined as number | undefined,
            radius: 150
        };
        
        const setCanvasSize = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }

        // NEW: Function to get dynamic particle count based on screen width
        const getParticleCount = () => {
            return window.innerWidth < 768 ? 150 : 420; // Reduce to ~1/3 on mobile (adjust as needed; 100-200 is a good range for perf)
        };

        class Particle implements ParticleType {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;

            constructor(x: number, y: number, vx: number, vy: number) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.radius = Math.random() * 1.5 + 1;
            }

            update(canvasWidth: number, canvasHeight: number, mouse: { x?: number, y?: number, radius: number }) {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = canvasWidth;
                if (this.x > canvasWidth) this.x = 0;
                if (this.y < 0) this.y = canvasHeight;
                if (this.y > canvasHeight) this.y = 0;

                if (mouse.x !== undefined && mouse.y !== undefined) {
                    const dx_mouse = this.x - mouse.x;
                    const dy_mouse = this.y - mouse.y;
                    const distance_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
                    if (distance_mouse < mouse.radius) {
                        const forceDirectionX = dx_mouse / distance_mouse;
                        const forceDirectionY = dy_mouse / distance_mouse;
                        const force = (mouse.radius - distance_mouse) / mouse.radius;
                        const maxPush = 2;
                        this.x += forceDirectionX * force * maxPush;
                        this.y += forceDirectionY * force * maxPush;
                    }
                }
            }

            draw(context: CanvasRenderingContext2D) {
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                context.fillStyle = `${particleColor} 1)`;
                context.fill();
            }
        }
        
        const init = () => {
            particles = [];
            const particleCount = getParticleCount(); // Use dynamic count here
            const midPoint = canvas.width / 2;
            for (let i = 0; i < particleCount; i++) {
                let x: number, vx: number;
                if (i < particleCount / 2) {
                    x = Math.random() * midPoint;
                    vx = Math.random() * 0.5 + 0.1;
                } else {
                    x = midPoint + Math.random() * midPoint;
                    vx = -(Math.random() * 0.5 + 0.1);
                }
                const y = Math.random() * canvas.height;
                const vy = (Math.random() - 0.5) * 0.5;
                particles.push(new Particle(x, y, vx, vy));
            }
        }
        
        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = 1 - (distance / maxDistance);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `${particleColor} ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update(canvas.width, canvas.height, mouse);
                p.draw(ctx);
            });
            connectParticles();
            
            if (mouse.x !== undefined && mouse.y !== undefined) {
                particles.forEach(p => {
                    const dx = p.x - mouse.x!;
                    const dy = p.y - mouse.y!;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const opacity = 1 - (distance / mouse.radius);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x!, mouse.y!);
                        ctx.strokeStyle = `${particleColor} ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        // NEW: Debounce function to throttle resize events
        function debounce(func: (...args: any[]) => void, delay: number) {
            let timeout: NodeJS.Timeout | null = null;
            return function(...args: any[]) {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), delay);
            };
        }

        // MODIFIED: Handle resize with debounce and size-change check
        const handleResize = () => {
            const oldWidth = canvas.width;
            const oldHeight = canvas.height;
            setCanvasSize();
            // Only re-init if size actually changed (prevents unnecessary "refresh" on mobile scroll)
            if (oldWidth !== canvas.width || oldHeight !== canvas.height) {
                init();
            }
        };

        const debouncedResize = debounce(handleResize, 200); // 200ms delay; adjust if needed

        // MODIFIED: Handle mouse move (add { passive: true } for better scroll perf on touch devices)
        const handleMouseMove = (event: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        }

        const handleMouseOut = () => {
            mouse.x = undefined;
            mouse.y = undefined;
        }

        // Add listeners with passive option where possible
        window.addEventListener('resize', debouncedResize);
        container.addEventListener('mousemove', handleMouseMove, { passive: true });
        container.addEventListener('mouseout', handleMouseOut, { passive: true });

        // Initial setup
        setCanvasSize();
        init();
        animate();

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            window.removeEventListener('resize', debouncedResize);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
    
        <div ref={containerRef} className={`relative isolate w-full ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full -z-10 opacity-50"
            />
            {/* The children are now direct descendants, no extra div needed */}
            {children}
        </div>
    );
    
};