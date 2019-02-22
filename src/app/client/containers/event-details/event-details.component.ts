import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../../shared/services/events.service';
import { Observable, Subscription } from 'rxjs';
import { EventItem, ClientUser } from '../../../shared/models';
import { EventsRegistrationService } from '../../services/events-registration.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import swal from 'sweetalert';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsComponent implements OnDestroy {
  eventItem$: Observable<EventItem>;
  bookLoading = false;
  unbookLoading = false;
  loggedInUser: ClientUser;
  loggedInUserSubscription: Subscription;

  constructor(
    navigationService: NavigationService,
    route: ActivatedRoute,
    eventsService: EventsService,
    private eventsRegistrationService: EventsRegistrationService,
    authService: AuthService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    const id = route.snapshot.params['id'];
    this.eventItem$ = eventsService.getEventItem(id);
    navigationService.scrollBreakpoint.next(0);
    this.loggedInUserSubscription = authService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
      this.cd.markForCheck();
    });
  }

  async handleBookForEvent(event: EventItem) {
    if (this.bookLoading || this.unbookLoading) return;
    this.bookLoading = true;
    if (!this.loggedInUser) return this.router.navigate(['/auth']);
    try {
      await this.eventsRegistrationService.bookEvent(event, this.loggedInUser);
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
  }

  async handleUnbookForEvent(event: EventItem) {
    if (this.unbookLoading || this.bookLoading) return;
    this.unbookLoading = true;
    if (!this.loggedInUser) return this.router.navigate(['/auth']);
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
      await this.eventsRegistrationService.unbookEvent(event, this.loggedInUser);
    } catch (e) {
      this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
    } finally {
      this.unbookLoading = false;
      this.cd.markForCheck();
    }
    this.snackBar.open(`Rezervácia pre udalosť "${event.heading}" bola úspešne zrušená!`, null, { duration: 5000 });
  }

  ngOnDestroy() {
    this.loggedInUserSubscription.unsubscribe();
  }
}
