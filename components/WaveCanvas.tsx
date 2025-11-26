import React, { useEffect, useRef } from 'react';
import { WaveParams } from '../types';

interface WaveCanvasProps {
  colors: string[];
  params: WaveParams;
  isPlaying: boolean;
}

const WaveCanvas: React.FC<WaveCanvasProps> = ({ colors, params, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const render = () => {
      if (!ctx || !canvas) return;
      
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Clear with trail effect for "motion blur" feel
      ctx.fillStyle = 'rgba(9, 9, 11, 0.2)'; // Use theme bg with opacity
      ctx.fillRect(0, 0, width, height);

      // Increment time
      if (isPlaying) {
        timeRef.current += params.speed;
      }

      // Draw Layers
      colors.forEach((color, i) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 + i; // Thicker lines for back layers
        
        // Offset each layer slightly in phase and speed
        const layerOffset = i * (Math.PI / colors.length);
        const layerSpeedMult = 1 + (i * 0.1); 
        
        for (let x = 0; x < width; x += 2) { // Optimization: step by 2px
          let y = centerY;
          
          // Complex Wave function
          // Basic Sine
          const sine1 = Math.sin(x * params.frequency + timeRef.current * layerSpeedMult + layerOffset);
          
          // Secondary harmonic for complexity
          const sine2 = Math.sin(x * (params.frequency * 2.5) - timeRef.current * 0.5);
          
          // Noise-ish layer (simulated with high freq sine)
          const noise = params.complexity > 3 
            ? Math.sin(x * 0.1 + timeRef.current) * (params.complexity / 20) 
            : 0;

          // Combine
          let wave = sine1 + (sine2 * 0.5) + noise;
          
          // Apply Tension (Distort the sine wave to be spikier or rounder)
          // Simple shaping function
          if (params.tension > 1.2) {
             // Spiky: Power function preserves sign
             wave = Math.sign(wave) * Math.pow(Math.abs(wave), params.tension);
          }
          
          y += wave * params.amplitude;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        
        // Optional: Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      });

      // Reset shadow for next frame clearance
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [colors, params, isPlaying]); // Re-init loop if params change is okay, refs handle the tight loop values

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
    />
  );
};

export default WaveCanvas;