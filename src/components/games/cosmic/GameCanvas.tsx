'use client';

import { useEffect, useRef } from 'react';
import { CosmicGameState } from '@/hooks/useCosmicGame';

interface GameCanvasProps {
  gameState: CosmicGameState;
}

// Draw a star field and render canvas effects
export default function GameCanvas({ gameState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{ x: number; y: number; r: number; speed: number; opacity: number }[]>([]);
  const rafRef = useRef<number>(0);

  // Init stars
  useEffect(() => {
    starsRef.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const W = canvas.width;
      const H = canvas.height;

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#020409');
      bg.addColorStop(0.5, '#060d1f');
      bg.addColorStop(1, '#0a0520');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Nebula blobs
      const nebula = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, W * 0.4);
      nebula.addColorStop(0, 'rgba(108,142,247,0.04)');
      nebula.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, W, H);

      const nebula2 = ctx.createRadialGradient(W * 0.8, H * 0.7, 0, W * 0.8, H * 0.7, W * 0.35);
      nebula2.addColorStop(0, 'rgba(167,139,250,0.05)');
      nebula2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, W, H);

      // Scrolling stars
      for (const star of starsRef.current) {
        if (gameState.status === 'playing') {
          star.y += star.speed * dt * 10;
          if (star.y > 100) { star.y = 0; star.x = Math.random() * 100; }
        }
        ctx.beginPath();
        ctx.arc((star.x / 100) * W, (star.y / 100) * H, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();
      }

      // Defense line
      const lineY = H * 0.9;
      const lineGrad = ctx.createLinearGradient(0, lineY, W, lineY);
      lineGrad.addColorStop(0, 'transparent');
      lineGrad.addColorStop(0.2, 'rgba(108,142,247,0.6)');
      lineGrad.addColorStop(0.5, 'rgba(167,139,250,0.8)');
      lineGrad.addColorStop(0.8, 'rgba(108,142,247,0.6)');
      lineGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(W, lineY);
      ctx.stroke();

      // Glow below defense line
      const glowGrad = ctx.createLinearGradient(0, lineY, 0, H);
      glowGrad.addColorStop(0, 'rgba(108,142,247,0.08)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, lineY, W, H - lineY);

      // Explosions
      const now2 = Date.now();
      for (const ex of gameState.explosions) {
        const age = now2 - ex.at;
        if (age > 600) continue;
        const progress = age / 600;
        const radius = progress * 80;
        const alpha = 1 - progress;
        const exX = (ex.x / 100) * W;
        const exY = (ex.y / 100) * H;

        const expGrad = ctx.createRadialGradient(exX, exY, 0, exX, exY, radius);
        expGrad.addColorStop(0, `rgba(255,200,50,${alpha * 0.9})`);
        expGrad.addColorStop(0.4, `rgba(255,100,20,${alpha * 0.6})`);
        expGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = expGrad;
        ctx.beginPath();
        ctx.arc(exX, exY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Particles
        for (let p = 0; p < 8; p++) {
          const angle = (p / 8) * Math.PI * 2;
          const dist = radius * 0.8;
          ctx.beginPath();
          ctx.arc(
            exX + Math.cos(angle) * dist,
            exY + Math.sin(angle) * dist,
            2 * (1 - progress),
            0, Math.PI * 2
          );
          ctx.fillStyle = `rgba(255,180,50,${alpha})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState.explosions, gameState.status]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
