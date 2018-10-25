import { Directive, HostListener, ElementRef, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appNavigationItem]'
})
export class NavigationItemDirective {
  hover = new EventEmitter<boolean>();

  constructor(private el: ElementRef) {}

  get elementWidth() {
    return this.el.nativeElement.offsetWidth;
  }

  get active() {
    return (<HTMLAnchorElement>this.el.nativeElement).classList.contains('active');
  }

  @HostListener('mouseenter')
  mouseEnter() {
    this.hover.emit(true);
  }

  @HostListener('mouseleave')
  mouseLeave() {
    this.hover.emit(false);
  }
}
