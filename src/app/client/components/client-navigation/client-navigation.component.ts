import { Component, ChangeDetectionStrategy, HostListener, Input } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-client-navigation',
  templateUrl: './client-navigation.component.html',
  styleUrls: ['./client-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientNavigationComponent {
  @Input() scrollBreakpoint: number;

  navigationExpanded = false;
  transparentNavigation = true;
  navItems: { label: string; path: string }[] = [
    {
      label: 'DOMOV',
      path: '/'
    },
    {
      label: 'AKTUALITY',
      path: '/news'
    },
    {
      label: 'PROGRAM',
      path: '/events'
    },
    {
      label: 'KURZY',
      path: '/courses'
    },
    {
      label: 'SLUŽBY',
      path: '/services'
    },
    {
      label: 'GALÉRIA',
      path: '/gallery'
    },
    {
      label: 'KONTAKT',
      path: '/contacts'
    }
  ];

  constructor(private scroller: ViewportScroller) {}

  openNavigation() {
    this.navigationExpanded = true;
  }

  closeNavigation() {
    this.navigationExpanded = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.transparentNavigation = this.scrollBreakpoint >= this.scroller.getScrollPosition()[1];
  }
}
