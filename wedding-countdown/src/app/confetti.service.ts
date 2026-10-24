import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

const COLORS = ['#e6c78f', '#f4b9b2', '#ffffff', '#7fc4c0', '#f7dccf'];

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  burst(origin: { x: number; y: number } = { x: 0.5, y: 0.5 }): void {
    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 42,
      origin,
      colors: COLORS,
      scalar: 1.05,
      disableForReducedMotion: true,
    });
  }

  /** Side cannons for a few seconds, then a gentle burst every 6s. */
  grandFinale(): void {
    const end = Date.now() + 4500;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS, disableForReducedMotion: true });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS, disableForReducedMotion: true });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    setInterval(() => this.burst({ x: Math.random() * 0.6 + 0.2, y: 0.35 }), 6000);
  }
}
