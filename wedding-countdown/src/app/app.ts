import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Blessing } from './blessing/blessing';
import { ConfettiService } from './confetti.service';
import { Hero } from './hero/hero';

@Component({
  selector: 'app-root',
  imports: [Hero, Blessing],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly confetti = inject(ConfettiService);
  private readonly celebration = viewChild<ElementRef<HTMLElement>>('celebration');

  protected readonly arrived = signal(false);

  protected onArrived(): void {
    this.arrived.set(true);
    this.confetti.grandFinale();
    setTimeout(() => this.celebration()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }
}
