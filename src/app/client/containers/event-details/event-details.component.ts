import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../shared/services/events.service';
import { Observable } from 'rxjs';
import { EventItem, ClientUser } from '../../../shared/models';
import { EventsRegistrationService } from '../../services/events-registration.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsComponent {
  eventItem$: Observable<EventItem>;
  loggedInUser$: Observable<ClientUser>;

  constructor(
    navigationService: NavigationService,
    route: ActivatedRoute,
    eventsService: EventsService,
    private eventsRegistrationService: EventsRegistrationService,
    authService: AuthService
  ) {
    const id = route.snapshot.params['id'];
    this.eventItem$ = eventsService.getEventItem(id);
    this.loggedInUser$ = authService.loggedInUser;
    navigationService.scrollBreakpoint.next(0);
  }

  handleBookForEvent(event: EventItem) {
    this.eventsRegistrationService.bookEvent(event);
  }

  handleUnbookForEvent(event: EventItem) {
    this.eventsRegistrationService.unbookEvent(event);
  }
}
