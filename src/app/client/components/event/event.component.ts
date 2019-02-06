import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { EventItem } from '../../../shared/models';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventComponent {
  @Input() itemData: EventItem;
  @Input() loggedIn: boolean;
  @Output() bookClicked = new EventEmitter();
}
