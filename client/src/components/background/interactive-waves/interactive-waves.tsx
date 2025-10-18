// src/components/background/interactive-waves/interactive-waves.tsx

import React, { useRef, useEffect, PropsWithChildren } from 'react';

// The new wrapper component for the animated background
export const InteractiveWavesBackground: React.FC<PropsWithChildren> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        let animationFrameId: number;
        let waveBundles: WaveBundle[] = [];
        const mousePos = { x: -1000, y: -1000 };

        // --- OPTIMIZATION: Helper to check for mobile screen size ---
        const isMobile = () => window.innerWidth <= 768;

        // Track previous dimensions to detect meaningful changes
        let prevWidth = window.innerWidth;
        let prevHeight = window.innerHeight;

        class WaveBundle {
            baseY: number;
            numLines: number;
            interactionSpread: number; // The spread when mouse is near
            baseSpread: number; // The default, tighter spread
            currentSpread: number; // The animated spread value
            guideWaveAmplitude: number;
            guideWaveFrequency: number;
            spreadWaveFrequency: number;
            phase: number;
            speed: number;

            constructor(y: number) {
                this.baseY = y;
                
                // --- OPTIMIZATION: Use different settings for mobile vs. desktop ---
                if (isMobile()) {
                    // --- MOBILE SETTINGS ---
                    this.numLines = Math.floor(Math.random() * 5) + 8; // 8-13 lines
                    this.interactionSpread = Math.random() * 110 + 80; // 100-220
                    this.baseSpread = Math.random() * 15 + 15; // 20-40
                    this.guideWaveAmplitude = Math.random() * 40 + 30; // 30-70
                    this.guideWaveFrequency = (Math.random() * 0.003) + 0.001; // 0.001-0.004
                    this.speed = (Math.random() * 0.005) + 0.002; // 0.002-0.007
                } else {
                    // --- DESKTOP SETTINGS (Unchanged) ---
                    this.numLines = Math.floor(Math.random() * 10) + 10; // 10-20 lines
                    this.interactionSpread = Math.random() * 100 + 60; // 60-160
                    this.baseSpread = Math.random() * 20 + 10; // 10-30
                    this.guideWaveAmplitude = Math.random() * 100 + 60; // 60-160
                    this.guideWaveFrequency = (Math.random() * 0.005) + 0.002; // 0.002-0.007
                    this.speed = (Math.random() * 0.005) + 0.001; // 0.001-0.006
                }
                
                this.currentSpread = this.baseSpread;
                this.spreadWaveFrequency = (Math.random() * 0.01) + 0.005;
                this.phase = Math.random() * Math.PI * 2;
            }

            update(mousePosition: {x: number, y: number}) {
                this.phase += this.speed;

                const guideYAtMouseX = Math.sin(mousePosition.x * this.guideWaveFrequency + this.phase) * this.guideWaveAmplitude + this.baseY;
                const distanceToMouse = Math.abs(guideYAtMouseX - mousePosition.y);
                const spreadRadius = 150; 

                const targetSpread = distanceToMouse < spreadRadius ? this.interactionSpread : this.baseSpread;
                this.currentSpread += (targetSpread - this.currentSpread) * 0.05;
            }

            draw(context: CanvasRenderingContext2D, canvasWidth: number, mousePosition: {x: number, y: number}) {
                context.strokeStyle = `rgba(19, 104, 133, 0.4)`;
                context.lineWidth = 0.5;
                
                const segmentLength = 10; 

                for (let i = 0; i < this.numLines; i++) {
                    context.beginPath();
                    context.moveTo(0, this.calculateY(0, i, mousePosition));
                    
                    for (let x = segmentLength; x < canvasWidth; x += segmentLength) {
                        context.lineTo(x, this.calculateY(x, i, mousePosition));
                    }
                    context.lineTo(canvasWidth, this.calculateY(canvasWidth, i, mousePosition));
                    
                    context.stroke();
                }
            }

            calculateY(x: number, lineIndex: number, mousePosition: {x: number, y: number}): number {
                const guideY = Math.sin(x * this.guideWaveFrequency + this.phase) * this.guideWaveAmplitude + this.baseY;
                const spreadModulator = Math.pow(Math.sin(x * this.spreadWaveFrequency + this.phase), 2);
                const lineOffset = (lineIndex / (this.numLines - 1) - 0.5) * 2 * this.currentSpread;
                let finalY = guideY + lineOffset * spreadModulator;

                const dx = x - mousePosition.x;
                const dy = finalY - mousePosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const interactionRadius = 200;
                const maxDisplacement = 80;

                if (distance < interactionRadius) {
                    const force = 1 - (distance / interactionRadius);
                    const displacement = force * maxDisplacement;
                    finalY -= displacement;
                }
                return finalY;
            }
        }

        const init = (fullReinit: boolean) => {
            const canvasHeight = canvas.height;
            
            // --- [FIX 1] ---
            // This is correct: 10 bundles for mobile, 6 for desktop
            const numBundles = isMobile() ? 8 : 6;
            // --- [END FIX 1] ---

            if (fullReinit || waveBundles.length !== numBundles) {
                // Full reinitialization: Only do this on first load or when numBundles changes (e.g., orientation shift)
                waveBundles = [];
                for (let i = 0; i < numBundles; i++) {
                    const y = (canvasHeight / numBundles) * i + (canvasHeight / numBundles / 2);
                    waveBundles.push(new WaveBundle(y));
                }
            } else {
                // Partial update: Adjust baseY for existing bundles without recreating them
                waveBundles.forEach((bundle, i) => {
                    bundle.baseY = (canvasHeight / numBundles) * i + (canvasHeight / numBundles / 2);
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            waveBundles.forEach(bundle => {
                bundle.update(mousePos); 
                bundle.draw(ctx, canvas.width, mousePos);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleInteractionMove = (event: MouseEvent | TouchEvent) => {
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                let clientX = 0;
                let clientY = 0;

                if ('touches' in event) {
                    if (event.touches.length > 0) {
                        clientX = event.touches[0].clientX;
                        clientY = event.touches[0].clientY;
                    }
                } else {
                    clientX = event.clientX;
                    clientY = event.clientY;
                }
                mousePos.x = clientX - rect.left;
                mousePos.y = clientY - rect.top;
            }
        };

        const handleInteractionEnd = () => {
            mousePos.x = -1000;
            mousePos.y = -1000;
        }

        // Set canvas drawing size to match window
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            canvas.width = newWidth;
            canvas.height = newHeight;

            // Determine if we need a full reinit (e.g., width changed, which might mean orientation or mobile mode shift)
            const fullReinit = Math.abs(newWidth - prevWidth) > 0; // Any width change triggers full reinit
            init(fullReinit);

            prevWidth = newWidth;
            prevHeight = newHeight;
        };
        
        // Use the window for move/end events since the canvas is fixed
        window.addEventListener('mousemove', handleInteractionMove);
        window.addEventListener('mouseleave', handleInteractionEnd);

        window.addEventListener('touchstart', handleInteractionMove, { passive: true });
        window.addEventListener('touchmove', handleInteractionMove, { passive: true });
        window.addEventListener('touchend', handleInteractionEnd);
        window.addEventListener('touchcancel', handleInteractionEnd);

        window.addEventListener('resize', handleResize);
        
        // Initial setup
        handleResize(); // This will do a full init on load
        animate();

        return () => {
            // Remove all event listeners
            window.removeEventListener('mousemove', handleInteractionMove);
            window.removeEventListener('mouseleave', handleInteractionEnd);
            
            window.removeEventListener('touchstart', handleInteractionMove);
            window.removeEventListener('touchmove', handleInteractionMove);
            window.removeEventListener('touchend', handleInteractionEnd);
            window.removeEventListener('touchcancel', handleInteractionEnd);

            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };

    }, []);

    return (
        // --- [FIX 2] ---
        // Removed `position: 'relative'` to simplify the stacking context
        <div  className="relative overflow-hidden" style={{ width: '100%', background: '#F8F9FA' }}>
        {/* --- [END FIX 2] --- */}
            
            {/* Canvas is position: fixed to lock it to the viewport background */}
            <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full opacity-80 z-0"

                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    zIndex: 0, 
                    width: '100vw', 
                    height: '100vh' 
                }} 
            />
            
            {/* This content wrapper with zIndex: 1 will now scroll over the fixed canvas */}
            <div className="relative z-1" style={{   opacity: 0.99 }}>
                {children}
            </div>
        </div>
    );
};