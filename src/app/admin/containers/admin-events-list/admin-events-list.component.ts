import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { EventItem } from '../../../shared/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-events-list',
  templateUrl: './admin-events-list.component.html',
  styleUrls: ['./admin-events-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEventsListComponent {
  events$: Observable<EventItem[]>;
  eventsCount$: Observable<number>;
  eventsLength = 0;
  loadMore = new BehaviorSubject(null);
  isLoading = false;
  limit = 5;

  constructor(private eventsService: EventsService) {
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
          .pipe(tap(events => (this.eventsLength = events.length)))
      ),
      tap(() => (this.isLoading = false))
    );
    this.eventsCount$ = eventsService.getEventsCount();
  }

  trackByFn(index: number) {
    return index;
  }
}
