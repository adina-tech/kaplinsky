import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

interface Glint { x: number; y: number; r: number; p: number; v: number; dx: number }

/** Sun glints twinkling on the water, drawn on the host canvas. */
@Directive({ selector: 'canvas[appGlints]' })
export class Glints {
  private readonly canvas = inject<ElementRef<HTMLCanvasElement>>(ElementRef).nativeElement;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const ctx = this.canvas.getContext('2d');
      if (!ctx) return;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let w = 0, h = 0, raf = 0, dots: Glint[] = [];

      const size = () => {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        w = this.canvas.clientWidth;
        h = this.canvas.clientHeight;
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const n = Math.round(Math.min(90, (w * h) / 9000));
        dots = Array.from({ length: n }, () => ({
          x: Math.random() * w,
          y: h * (0.3 + Math.random() * 0.55),
          r: 0.6 + Math.random() * 1.8,
          p: Math.random() * Math.PI * 2,
          v: 0.6 + Math.random() * 1.6,
          dx: (Math.random() - 0.5) * 0.15,
        }));
      };

      const draw = (t: number) => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#fff';
        for (const g of dots) {
          const a = Math.max(0, Math.sin((t / 1000) * g.v + g.p));
          if (a < 0.05) continue;
          g.x += g.dx;
          if (g.x < 0) g.x = w;
          if (g.x > w) g.x = 0;
          const ray = g.r * (1 + a * 2.2);
          ctx.globalAlpha = a * 0.85;
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.r * a, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = a * 0.45;
          ctx.fillRect(g.x - ray, g.y - 0.4, ray * 2, 0.8);
          ctx.fillRect(g.x - 0.4, g.y - ray, 0.8, ray * 2);
        }
        if (!reduce) raf = requestAnimationFrame(draw);
      };

      size();
      addEventListener('resize', size);
      raf = requestAnimationFrame(draw);

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(raf);
        removeEventListener('resize', size);
      });
    });
  }
}
