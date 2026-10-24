import { Component, output } from '@angular/core';
import { Countdown } from '../countdown/countdown';
import { WEDDING } from '../wedding';
import { Glints } from './glints';

@Component({
  selector: 'app-hero',
  imports: [Countdown, Glints],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly finished = output<void>();
  protected readonly wedding = WEDDING;
}
