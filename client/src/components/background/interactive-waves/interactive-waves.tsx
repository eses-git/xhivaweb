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
        let waveBundles: WaveBundle[];
        const mousePos = { x: -1000, y: -1000 };

        // --- OPTIMIZATION: Helper to check for mobile screen size ---
        const isMobile = () => window.innerWidth <= 768;

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
                    // Mobile: More (16), but tighter and flatter bundles
                    this.numLines = Math.floor(Math.random() * 5) + 8; // 8-13 lines
                    this.interactionSpread = Math.random() * 60 + 30; // 30-90 (Tighter spread)
                    this.baseSpread = Math.random() * 10 + 5; // 5-15 (Tighter base)
                    this.guideWaveAmplitude = Math.random() * 40 + 30; // 30-70 (Even flatter waves to fit 16)
                    this.guideWaveFrequency = (Math.random() * 0.003) + 0.001; // 0.001-0.004 (Wider)
                    this.speed = (Math.random() * 0.005) + 0.002; // 0.002-0.007 (Slightly faster)
                } else {
                    // Desktop: 6 bundles
                    this.numLines = Math.floor(Math.random() * 10) + 10; // 10-20 lines
                    this.interactionSpread = Math.random() * 100 + 60; // 60-160
                    this.baseSpread = Math.random() * 20 + 10; // 10-30
                    this.guideWaveAmplitude = Math.random() * 100 + 60; // 60-160
                    this.guideWaveFrequency = (Math.random() * 0.005) + 0.002; // 0.002-0.007
                    this.speed = (Math.random() * 0.005) + 0.001; // 0.001-0.006 (Original speed)
                }
                
                // These are fine for both
                this.currentSpread = this.baseSpread;
                this.spreadWaveFrequency = (Math.random() * 0.01) + 0.005;
                this.phase = Math.random() * Math.PI * 2;
            }

            update(mousePosition: {x: number, y: number}) {
                this.phase += this.speed;

                // --- Open/Close Logic ---
                const guideYAtMouseX = Math.sin(mousePosition.x * this.guideWaveFrequency + this.phase) * this.guideWaveAmplitude + this.baseY;
                const distanceToMouse = Math.abs(guideYAtMouseX - mousePosition.y);
                const spreadRadius = 150; 

                const targetSpread = distanceToMouse < spreadRadius ? this.interactionSpread : this.baseSpread;
                this.currentSpread += (targetSpread - this.currentSpread) * 0.05;
            }

            draw(context: CanvasRenderingContext2D, canvasWidth: number, mousePosition: {x: number, y: number}) {
                context.strokeStyle = `rgba(19, 104, 133, 0.4)`;
                context.lineWidth = 0.5;
                
                // --- OPTIMIZATION: Draw in segments for performance ---
                const segmentLength = 10; // Draw in 10px segments

                for (let i = 0; i < this.numLines; i++) {
                    context.beginPath();
                    context.moveTo(0, this.calculateY(0, i, mousePosition));
                    
                    // Loop in segments instead of 1-pixel steps
                    for (let x = segmentLength; x < canvasWidth; x += segmentLength) {
                        context.lineTo(x, this.calculateY(x, i, mousePosition));
                    }
                    // Ensure the line always draws to the very end of the canvas
                    context.lineTo(canvasWidth, this.calculateY(canvasWidth, i, mousePosition));
                    
                    context.stroke();
                }
            }

            calculateY(x: number, lineIndex: number, mousePosition: {x: number, y: number}): number {
                const guideY = Math.sin(x * this.guideWaveFrequency + this.phase) * this.guideWaveAmplitude + this.baseY;
                const spreadModulator = Math.pow(Math.sin(x * this.spreadWaveFrequency + this.phase), 2);
                const lineOffset = (lineIndex / (this.numLines - 1) - 0.5) * 2 * this.currentSpread;
                let finalY = guideY + lineOffset * spreadModulator;

                // --- Repulsion Logic ---
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

        const init = () => {
            waveBundles = [];
            const canvasHeight = canvas.height;
            // --- UPDATED: 16 bundles on mobile, 6 on desktop ---
            const numBundles = isMobile() ? 16 : 6;
            for (let i = 0; i < numBundles; i++) {
                const y = (canvasHeight / numBundles) * i + (canvasHeight / numBundles / 2);
                waveBundles.push(new WaveBundle(y));
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

        // --- OPTIMIZATION: Combined handler for Mouse and Touch events ---
        const handleInteractionMove = (event: MouseEvent | TouchEvent) => {
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                let clientX = 0;
                let clientY = 0;

                if ('touches' in event) {
                    // Touch event
                    if (event.touches.length > 0) {
                        clientX = event.touches[0].clientX;
                        clientY = event.touches[0].clientY;
                    }
                } else {
                    // Mouse event
                    clientX = event.clientX;
                    clientY = event.clientY;
                }
                mousePos.x = clientX - rect.left;
                mousePos.y = clientY - rect.top;
            }
        };

        // --- OPTIMIZATION: Handler for mouse leave or touch end ---
        const handleInteractionEnd = () => {
            mousePos.x = -1000;
            mousePos.y = -1000;
        }

        const handleResize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
                init(); // Re-initialize waves with new (and potentially mobile) settings
            }
        };
        
        const parentElement = canvas.parentElement;
        
        // Add all event listeners
        parentElement?.addEventListener('mousemove', handleInteractionMove);
        parentElement?.addEventListener('mouseleave', handleInteractionEnd);

        parentElement?.addEventListener('touchstart', handleInteractionMove, { passive: true });
        parentElement?.addEventListener('touchmove', handleInteractionMove, { passive: true });
        parentElement?.addEventListener('touchend', handleInteractionEnd);
        parentElement?.addEventListener('touchcancel', handleInteractionEnd);

        window.addEventListener('resize', handleResize);
        
        // Initial setup
        handleResize();
        animate();

        return () => {
            // Remove all event listeners
            parentElement?.removeEventListener('mousemove', handleInteractionMove);
            parentElement?.removeEventListener('mouseleave', handleInteractionEnd);
            
            parentElement?.removeEventListener('touchstart', handleInteractionMove);
            parentElement?.removeEventListener('touchmove', handleInteractionMove);
            parentElement?.removeEventListener('touchend', handleInteractionEnd);
            parentElement?.removeEventListener('touchcancel', handleInteractionEnd);

            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };

    }, []);

    return (
        // Added a fallback background color
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#F8F9FA' }}>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
                {children}
            </div>
        </div>
    );
};