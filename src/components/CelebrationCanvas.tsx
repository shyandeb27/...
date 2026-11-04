import React, { useEffect, useRef } from 'react';
import { Particle } from '../types';

interface CelebrationCanvasProps {
  active: boolean;
}

export const CelebrationCanvas: React.FC<CelebrationCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const pastelPalette = [
      '#FCA5A5', // Soft blush pink
      '#F472B6', // Warm rose
      '#FBBF24', // Warm gold
      '#FDE047', // Soft sunlight
      '#DDD6FE', // Lavender
      '#FBCFE8', // Light cherry
      '#FDE68A', // Buttercream gold
    ];

    const particles: Particle[] = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: height + Math.random() * 80,
        size: 10 + Math.random() * 16,
        speedX: (Math.random() - 0.5) * 1.6,
        speedY: 1.4 + Math.random() * 2.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.035,
        opacity: 0.75 + Math.random() * 0.25,
        color: pastelPalette[Math.floor(Math.random() * pastelPalette.length)],
        type: Math.random() > 0.45 ? 'heart' : Math.random() > 0.5 ? 'petal' : 'sparkle',
        oscillationSpeed: 0.015 + Math.random() * 0.02,
        oscillationDistance: 0.8 + Math.random() * 1.2,
        age: 0,
        lifespan: 600 + Math.random() * 400,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.age++;
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.age * p.oscillationSpeed) * p.oscillationDistance;
        p.rotation += p.rotationSpeed;

        // Reset if drifted beyond top
        if (p.y < -40) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.type === 'heart') {
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
          ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, 0);
          ctx.fill();
        } else if (p.type === 'petal') {
          // Delicate sakura petal
          const w = p.size * 0.55;
          const h = p.size * 0.95;
          ctx.beginPath();
          ctx.ellipse(0, 0, w, h, Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 4-point soft sparkle
          const r = p.size * 0.5;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
            ctx.lineTo(
              Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.28),
              Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.28)
            );
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
};
