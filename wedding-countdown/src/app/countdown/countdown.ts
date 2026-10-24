import { Component, computed, DestroyRef, effect, inject, input, output, signal } from '@angular/core';

const DAY = 86_400_000;
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

  /** Saturdays left between tomorrow and the wedding day. */
  protected readonly shabbatot = computed(() => {
    const day = new Date(this.now());
    day.setHours(0, 0, 0, 0);
    const end = this.target().getTime();
    let count = 0;
    for (let t = day.getTime() + DAY; t < end; t += DAY) {
      if (new Date(t).getDay() === 6) count++;
    }
    return count;
  });

  constructor() {
    const id = setInterval(() => this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));

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
