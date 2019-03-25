import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../../shared/services/events.service';
import { Observable } from 'rxjs';
import { EventItem, ClientUser } from '../../../shared/models';
import { EventsRegistrationService } from '../../services/events-registration.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import swal from 'sweetalert';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsComponent {
  eventItem$: Observable<EventItem>;
  bookLoading = false;
  unbookLoading = false;
  loggedInUser$: Observable<ClientUser>;

  constructor(
    navigationService: NavigationService,
    route: ActivatedRoute,
    eventsService: EventsService,
    private eventsRegistrationService: EventsRegistrationService,
    authService: AuthService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) {
    const id = route.snapshot.params['id'];
    this.eventItem$ = eventsService.getEventItem(id);
    this.loggedInUser$ = authService.loggedInUser;
    navigationService.scrollBreakpoint.next(0);
  }

  async handleBookForEvent(event: EventItem, attendee: ClientUser) {
    if (this.bookLoading || this.unbookLoading) return;
    this.bookLoading = true;
    if (!attendee) return this.router.navigate(['/auth']);
    try {
      await this.eventsRegistrationService.bookEvent(event, attendee);
    } catch (e) {
      this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
    } finally {
      this.bookLoading = false;
      this.cd.markForCheck();
    }
    const opt: any = {
      button: {
        className: 'swal-ok-button'
      }
    };
    await swal(`Udalosť ${event.heading} bola úspešne rezervovaná.`, 'Tešíme sa na vás.', 'success', { ...opt });
  }

  async handleUnbookForEvent(event: EventItem, attendee: ClientUser) {
    if (this.unbookLoading || this.bookLoading) return;
    this.unbookLoading = true;
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
  }

  isBookedForUser(loggedInUser: ClientUser, event: EventItem): boolean {
    return loggedInUser && loggedInUser.events.indexOf(event.id) >= 0;
  }

  isSold(event: EventItem): boolean {
    return event.capacity && event.attendees.length >= event.capacity;
  }
}
