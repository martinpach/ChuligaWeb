import { Component, ContentChildren, AfterContentInit, QueryList, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { map, distinctUntilChanged, takeUntil, startWith, filter } from 'rxjs/operators';
import { NavigationItemDirective } from './navigation-item.directive';
import { NavigationBarComponent } from './navigation-bar.component';

@Component({
  selector: 'app-navigation',
  template: `<ng-content></ng-content>`
})
export class NavigationComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(NavigationItemDirective)
  navItems: QueryList<NavigationItemDirective>;
  @ContentChildren(NavigationBarComponent)
  bars: QueryList<NavigationBarComponent>;

  destroy$ = new Subject();

  constructor(private cd: ChangeDetectorRef) {}

  get activeIndex(): number {
    return this.navItems.toArray().findIndex(item => item.active);
  }

  ngAfterContentInit(): void {
    const positionMap = this.navItems.reduce(
      (prev, cur) => [
        ...prev,
        {
          width: cur.elementWidth,
          position: prev[prev.length - 1] ? prev[prev.length - 1].position + prev[prev.length - 1].width : 0
        }
      ],
      []
    );

    const activePosition$ = merge(...this.navItems.map((item, index) => item.hover.pipe(map(result => ({ result, index }))))).pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      startWith({ result: false, index: null }),
      map(({ result, index }) => positionMap[result ? index : this.activeIndex]),
      filter(({ index }) => index !== -1),
      takeUntil(this.destroy$)
    );

    setTimeout(
      () =>
        activePosition$.subscribe(({ width, position }) => {
          this.bars.forEach(bar => {
            bar.position = position;
            bar.width = width;
            bar.markDirty();
          });
        }),
      0
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
