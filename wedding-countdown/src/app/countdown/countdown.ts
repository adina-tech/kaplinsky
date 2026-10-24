import { Component, computed, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { ConfettiService } from '../confetti.service';

const pad = (n: number) => String(n).padStart(2, '0');

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
})
export class Countdown {
  readonly target = input.required<Date>();
  readonly finished = output<void>();

  private readonly now = signal(Date.now());

  protected readonly remaining = computed(() => Math.max(0, this.target().getTime() - this.now()));

  protected readonly units = computed(() => {
    const sec = Math.floor(this.remaining() / 1000);
    return [
      { label: 'ימים', value: String(Math.floor(sec / 86_400)) },
      { label: 'שעות', value: pad(Math.floor(sec / 3600) % 24) },
      { label: 'דקות', value: pad(Math.floor(sec / 60) % 60) },
      { label: 'שניות', value: pad(sec % 60) },
    ];
  });

  /** Whole minutes left; changes once a minute, when the seconds roll past 00. */
  private readonly minutesLeft = computed(() => Math.floor(this.remaining() / 60_000));

  constructor() {
    const id = setInterval(() => this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));

    // Celebrate every minute that passes (skipping the first read on page load)
    const confetti = inject(ConfettiService);
    let lastMinute: number | undefined;
    effect(() => {
      const minute = this.minutesLeft();
      if (lastMinute !== undefined && minute !== lastMinute && this.remaining() > 0) {
        confetti.burst({ x: 0.5, y: 0.45 });
      }
      lastMinute = minute;
    });

    let fired = false;
    effect(() => {
      if (this.remaining() === 0 && !fired) {
        fired = true;
        clearInterval(id);
        this.finished.emit();
      }
    });
  }
}
