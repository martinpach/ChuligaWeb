import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { EventItem, ClientUser } from '../../../shared/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { EventsService } from '../../../shared/services/events.service';
import { tap, switchMap, take } from 'rxjs/operators';
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
  bookLoading = false;
  unbookLoading = false;

  constructor(
    private eventsService: EventsService,
    navigationService: NavigationService,
    authService: AuthService,
    private router: Router,
    private eventsRegistrationService: EventsRegistrationService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {
    this.loggedInUser$ = authService.loggedInUser;
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
          .pipe(tap(news => (this.eventsLength = news.length)))
      ),
      tap(() => (this.isLoadingEvents = false))
    );
    this.eventsCount$ = eventsService.getEventsCount();
    navigationService.scrollBreakpoint.next(0);
  }

  handleBookForEvent(event: EventItem) {
    if (this.bookLoading || this.unbookLoading) return;
    this.bookLoading = true;
    this.loggedInUser$.pipe(take(1)).subscribe(async attendee => {
      if (!attendee) return this.router.navigate(['/auth']);
      try {
        await this.eventsRegistrationService.bookEvent(event, attendee);
      } catch (e) {
        this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
      } finally {
        this.bookLoading = false;
        this.cd.markForCheck();
      }
      await swal(`Udalosť ${event.heading} bola úspešne rezervovaná.`, 'Tešíme sa na vás.', 'success', {
        button: {
          className: 'swal-ok-button'
        }
      });
    });
  }

  handleUnbookForEvent(event: EventItem) {
    if (this.unbookLoading || this.bookLoading) return;
    this.unbookLoading = true;
    this.loggedInUser$.pipe(take(1)).subscribe(async attendee => {
      if (!attendee) return this.router.navigate(['/auth']);
      const isUnbookAllowed = await swal(`Naozaj chcete zrušiť rezerváciu pre udalosť ${event.heading}?`, {
        icon: 'warning',
        buttons: ['nie', 'áno'],
        dangerMode: true
      });
      if (!isUnbookAllowed) {
        this.unbookLoading = false;
        return this.cd.markForCheck();
      }
      try {
        await this.eventsRegistrationService.unbookEvent(event, attendee);
      } catch (e) {
        this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
      } finally {
        this.unbookLoading = false;
        this.cd.markForCheck();
      }
      this.snackBar.open(`Rezervácia pre udalosť "${event.heading}" bola úspešne zrušená!`, null, { duration: 5000 });
    });
  }

  navigateToEventDetails(event: EventItem) {
    this.router.navigate(['/events', event.id]);
  }

  trackByFn(index: number) {
    return index;
  }
}
