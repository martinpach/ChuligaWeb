import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { EventItem, ClientUser } from '../../../shared/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { EventsService } from '../../../shared/services/events.service';
import { tap, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EventsRegistrationService } from '../../services/events-registration.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsComponent {
  events$: Observable<EventItem[]>;
  eventsCount$: Observable<number>;
  loadMore = new BehaviorSubject(null);
  isLoading = false;
  eventsLength = 0;
  limit = 5;
  loggedInUser$: Observable<ClientUser>;

  constructor(
    private eventsService: EventsService,
    navigationService: NavigationService,
    authService: AuthService,
    private router: Router,
    private eventsRegistrationService: EventsRegistrationService
  ) {
    this.loggedInUser$ = authService.loggedInUser;
    this.events$ = this.loadMore.pipe(
      tap(() => (this.isLoading = true)),
      switchMap((_, index) =>
        eventsService
          .getEvents(ref =>
            ref
              .orderBy('date', 'asc')
              .limit(this.limit * (index + 1))
              .startAt(new Date())
          )
          .pipe(tap(news => (this.eventsLength = news.length)))
      ),
      tap(() => (this.isLoading = false))
    );
    this.eventsCount$ = eventsService.getEventsCount();
    navigationService.scrollBreakpoint.next(0);
  }

  handleBookForEvent(event: EventItem) {
    this.eventsRegistrationService.bookEvent(event);
  }

  handleUnbookForEvent(event: EventItem) {
    this.eventsRegistrationService.unbookEvent(event);
  }

  navigateToEventDetails(event: EventItem) {
    this.router.navigate(['/events', event.id]);
  }

  trackByFn(index: number) {
    return index;
  }
}
