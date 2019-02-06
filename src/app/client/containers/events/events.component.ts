import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { EventItem, ClientUser } from '../../../shared/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { EventsService } from '../../../shared/services/events.service';
import { tap, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../../shared/services/users.service';

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
    private usersService: UsersService
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
    this.loggedInUser$.pipe(take(1)).subscribe(async attendee => {
      if (!event.capacity || event.capacity >= event.attendees.length + 1) {
        const updatedEvent: EventItem = { ...event, attendees: [...(event.attendees || []), attendee.id] };
        const updatedAttendee: ClientUser = { ...attendee, events: [...(attendee.events || []), event.id] };
        const eventUpdatePromise = this.eventsService.updateEventItem(event.id, updatedEvent);
        const userUpdatePromise = this.usersService.updateUser(attendee.id, updatedAttendee);
        await Promise.all([eventUpdatePromise, userUpdatePromise]);
      }
    });
  }

  trackByFn(index: number) {
    return index;
  }
}
