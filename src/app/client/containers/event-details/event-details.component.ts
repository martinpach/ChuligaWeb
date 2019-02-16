import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../shared/services/events.service';
import { Observable } from 'rxjs';
import { EventItem } from '../../../shared/models';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsComponent {
  eventItem$: Observable<EventItem>;

  constructor(navigationService: NavigationService, route: ActivatedRoute, eventsService: EventsService) {
    const id = route.snapshot.params['id'];
    this.eventItem$ = eventsService.getEventItem(id);
    navigationService.scrollBreakpoint.next(0);
  }
}
