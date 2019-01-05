import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ViewportScroller } from '@angular/common';
import { OthersService } from '../../../shared/services/others.service';
import { OthersItem } from '../../../shared/models';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  @ViewChild('header') headerEl: ElementRef;
  @ViewChild('pageDescription', { read: ElementRef }) pageDescriptionEl: ElementRef;
  serverData$: Observable<{ [key: string]: OthersItem }[]>;
  isMobile: boolean;

  constructor(
    breakpointObserver: BreakpointObserver,
    private scroller: ViewportScroller,
    private othersService: OthersService,
    domSanitazer: DomSanitizer
  ) {
    breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(({ matches }) => (this.isMobile = matches));
    this.serverData$ = othersService.getOthersItems();
  }

  scrollDown() {
    this.pageDescriptionEl.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
