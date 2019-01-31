import { Component, ChangeDetectionStrategy, HostListener, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';
import { User } from 'firebase';

@Component({
  selector: 'app-client-navigation',
  templateUrl: './client-navigation.component.html',
  styleUrls: ['./client-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientNavigationComponent implements OnDestroy {
  @Input() loggedUser: User;
  @Output() logout = new EventEmitter();
  transparentNavigation: boolean;
  scrollBreakpoint: number;
  navigationExpanded = false;
  scrollBreakpointSubscription: Subscription;
  navItems: { label: string; path: string; exact?: boolean }[] = [
    {
      label: 'DOMOV',
      path: '/',
      exact: true
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

  constructor(private scroller: ViewportScroller, navigationService: NavigationService) {
    this.scrollBreakpointSubscription = navigationService.scrollBreakpoint.subscribe(scrollBreakpoint => {
      this.scrollBreakpoint = scrollBreakpoint;
      this.transparentNavigation = scrollBreakpoint > this.scroller.getScrollPosition()[1];
    });
  }

  ngOnDestroy() {
    this.scrollBreakpointSubscription.unsubscribe();
  }

  openNavigation() {
    this.navigationExpanded = true;
  }

  closeNavigation() {
    this.navigationExpanded = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.transparentNavigation = this.scrollBreakpoint > this.scroller.getScrollPosition()[1];
  }
}
