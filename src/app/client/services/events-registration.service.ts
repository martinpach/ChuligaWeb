import { Injectable } from '@angular/core';
import { EventItem, ClientUser } from '../../shared/models';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EventsService } from '../../shared/services/events.service';
import { UsersService } from '../../shared/services/users.service';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class EventsRegistrationService {
  loggedInUser$: Observable<ClientUser>;

  constructor(
    authService: AuthService,
    private router: Router,
    private eventsService: EventsService,
    private usersService: UsersService,
    private snackBar: MatSnackBar
  ) {
    this.loggedInUser$ = authService.loggedInUser;
  }

  bookEvent(event: EventItem) {
    this.loggedInUser$.pipe(take(1)).subscribe(async attendee => {
      if (!attendee) {
        return this.router.navigate(['/auth']);
      }
      if (!event.capacity || event.capacity >= event.attendees.length + 1) {
        const updatedEvent: EventItem = { ...event, attendees: [...(event.attendees || []), attendee.id] };
        const updatedAttendee: ClientUser = { ...attendee, events: [...(attendee.events || []), event.id] };
        const eventUpdatePromise = this.eventsService.updateEventItem(event.id, updatedEvent);
        const userUpdatePromise = this.usersService.updateUser(attendee.id, updatedAttendee);
        await Promise.all([eventUpdatePromise, userUpdatePromise]);
        this.snackBar.open(`Udalosť "${event.heading}" bola úspešne rezervovaná. Tešíme sa na vás.`, null, { duration: 5000 });
      }
    });
  }

  unbookEvent(event: EventItem) {
    this.loggedInUser$.pipe(take(1)).subscribe(async attendee => {
      const updatedEvent: EventItem = { ...event, attendees: event.attendees.filter(a => a !== attendee.id) };
      const updatedAttendee: ClientUser = { ...attendee, events: attendee.events.filter(e => e !== event.id) };
      const eventUpdatePromise = this.eventsService.updateEventItem(event.id, updatedEvent);
      const userUpdatePromise = this.usersService.updateUser(attendee.id, updatedAttendee);
      await Promise.all([eventUpdatePromise, userUpdatePromise]);
      this.snackBar.open(`Rezervácia pre udalosť "${event.heading}" bola úspešne zrušená!`, null, { duration: 5000 });
    });
  }
}
