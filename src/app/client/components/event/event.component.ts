import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { EventItem, ClientUser } from '../../../shared/models';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventComponent {
  @Input() itemData: EventItem;
  @Input() loggedInUser: ClientUser;
  @Output() bookClicked = new EventEmitter();
  @Output() unbookClicked = new EventEmitter();
  @Output() readMoreClicked = new EventEmitter();
}
