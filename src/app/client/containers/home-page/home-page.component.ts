import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ViewportScroller } from '@angular/common';
import { OthersService } from '../../../shared/services/others.service';
import { OthersItem } from '../../../shared/models';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {
  @ViewChild('header') headerEl: ElementRef;
  @ViewChild('pageDescription', { read: ElementRef }) pageDescriptionEl: ElementRef;
  serverData$: Observable<{ [key: string]: OthersItem }[]>;
  isMobile: boolean;

  constructor(
    breakpointObserver: BreakpointObserver,
    private scroller: ViewportScroller,
    private othersService: OthersService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private navigationService: NavigationService
  ) {
    breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(({ matches }) => (this.isMobile = matches));
    this.serverData$ = othersService.getOthersItems();
  }

  ngOnInit() {
    this.navigationService.scrollBreakpoint.next(this.headerEl.nativeElement.scrollHeight - 150);
  }

  scrollDown() {
    this.pageDescriptionEl.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
