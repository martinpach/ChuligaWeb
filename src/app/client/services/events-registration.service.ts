import { Injectable } from '@angular/core';
import { EventItem, ClientUser } from '../../shared/models';
import { EventsService } from '../../shared/services/events.service';
import { UsersService } from '../../shared/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class EventsRegistrationService {
  constructor(private eventsService: EventsService, private usersService: UsersService) {}

  bookEvent(event: EventItem, attendee: ClientUser): Promise<any> {
    event.attendees = event.attendees || [];
    if (!event.capacity || event.capacity >= event.attendees.length + 1) {
      const updatedEvent: EventItem = { ...event, attendees: [...(event.attendees || []), attendee.id] };
      const updatedAttendee: ClientUser = { ...attendee, events: [...(attendee.events || []), event.id] };
      const eventUpdatePromise = this.eventsService.updateEventItem(event.id, updatedEvent);
      const userUpdatePromise = this.usersService.updateUser(attendee.id, updatedAttendee);
      return Promise.all([eventUpdatePromise, userUpdatePromise]);
    }
    return Promise.reject();
  }

  unbookEvent(event: EventItem, attendee: ClientUser): Promise<any> {
    const updatedEvent: EventItem = { ...event, attendees: event.attendees.filter(a => a !== attendee.id) };
    const updatedAttendee: ClientUser = { ...attendee, events: attendee.events.filter(e => e !== event.id) };
    const eventUpdatePromise = this.eventsService.updateEventItem(event.id, updatedEvent);
    const userUpdatePromise = this.usersService.updateUser(attendee.id, updatedAttendee);
    return Promise.all([eventUpdatePromise, userUpdatePromise]);
  }
}
