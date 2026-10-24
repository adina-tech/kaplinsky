import { Component, inject } from '@angular/core';
import { ConfettiService } from '../confetti.service';
import { WEDDING } from '../wedding';

@Component({
  selector: 'app-blessing',
  templateUrl: './blessing.html',
  styleUrl: './blessing.scss',
})
export class Blessing {
  private readonly confetti = inject(ConfettiService);
  protected readonly wedding = WEDDING;

  protected sendConfetti(event: MouseEvent): void {
    const r = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.confetti.burst({ x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight });
  }
}
