import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { EventItem, ClientUser } from '../../../shared/models';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { EventsService } from '../../../shared/services/events.service';
import { tap, switchMap, take, refCount, publish } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EventsRegistrationService } from '../../services/events-registration.service';
import swal from 'sweetalert';
import { MatSnackBar } from '@angular/material';

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
  isLoadingEvents = false;
  eventsLength = 0;
  limit = 5;
  loggedInUser$: Observable<ClientUser>;
  loadingId: string = null;

  constructor(
    private eventsService: EventsService,
    navigationService: NavigationService,
    authService: AuthService,
    private router: Router,
    private eventsRegistrationService: EventsRegistrationService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {
    this.loggedInUser$ = authService.loggedInUser.pipe(
      publish(),
      refCount()
    );
    this.events$ = this.loadMore.pipe(
      tap(() => (this.isLoadingEvents = true)),
      switchMap((_, index) =>
        eventsService
          .getEvents(ref =>
            ref
              .orderBy('date', 'asc')
              .limit(this.limit * (index + 1))
              .startAt(new Date())
          )
          .pipe(tap(events => (this.eventsLength = events.length)))
      ),
      tap(() => (this.isLoadingEvents = false)),
      publish(),
      refCount()
    );
    this.eventsCount$ = eventsService.getEventsCount();
    navigationService.scrollBreakpoint.next(0);
  }

  async handleBookForEvent(event: EventItem, attendee: ClientUser) {
    if (!attendee) return this.router.navigate(['/auth']);
    this.loadingId = event.id;
    this.eventsRegistrationService
      .bookEvent(event, attendee)
      .then()
      .catch(() => {
        this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
        this.loadingId = null;
      });

    combineLatest(this.events$, this.loggedInUser$)
      .pipe(take(1))
      .subscribe(() => {
        const opt: any = {
          button: {
            className: 'swal-ok-button'
          }
        };
        this.loadingId = null;
        swal(`Udalosť ${event.heading} bola úspešne rezervovaná.`, 'Tešíme sa na vás.', 'success', { ...opt });
      });
  }

  async handleUnbookForEvent(event: EventItem, attendee: ClientUser) {
    if (!attendee) return this.router.navigate(['/auth']);
    const isUnbookAllowed = await swal(`Naozaj chcete zrušiť rezerváciu pre udalosť ${event.heading}?`, {
      icon: 'warning',
      buttons: ['nie', 'áno'],
      dangerMode: true
    });
    if (!isUnbookAllowed) return;
    this.loadingId = event.id;
    this.eventsRegistrationService
      .unbookEvent(event, attendee)
      .then()
      .catch(() => {
        this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
        this.loadingId = null;
      });
    combineLatest(this.events$, this.loggedInUser$)
      .pipe(take(1))
      .subscribe(() => {
        this.loadingId = null;
        this.snackBar.open(`Rezervácia pre udalosť "${event.heading}" bola úspešne zrušená!`, null, { duration: 5000 });
      });
  }

  navigateToEventDetails(event: EventItem) {
    this.router.navigate(['/events', event.id]);
  }

  isBookedForUser(loggedInUser: ClientUser, { id }: EventItem): boolean {
    return loggedInUser && loggedInUser.events.indexOf(id) >= 0;
  }

  trackByFn(index: number) {
    return index;
  }
}
