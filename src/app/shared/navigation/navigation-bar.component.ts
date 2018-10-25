import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  template: `
  <div class="line">
    <div class="bar" [style.width.px]="width" [style.left.px]="position"></div>
  </div>
  `,
  styles: [
    `
      .line {
        position: relative;
        width: 100%;
      }

      .bar {
        background-color: #1b5e20;
        position: absolute;
        transition: left 0.3s ease-in-out, width 0.3s ease-in-out;
        top: 0;
        height: 3px;
        z-index: 9;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBarComponent {
  constructor(private cd: ChangeDetectorRef) {}

  @Input()
  width: number;
  @Input()
  position: number;

  markDirty() {
    this.cd.markForCheck();
  }
}
