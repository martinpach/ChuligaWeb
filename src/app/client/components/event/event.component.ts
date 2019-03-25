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
  @Input() isBooked: boolean;
  @Input() loading: boolean;
  @Output() bookClicked = new EventEmitter();
  @Output() unbookClicked = new EventEmitter();
  @Output() readMoreClicked = new EventEmitter();

  isSold(): boolean {
    return this.itemData.capacity && this.itemData.attendees.length >= this.itemData.capacity;
  }

  handleClick() {
    this.isBooked ? this.unbookClicked.emit() : this.bookClicked.emit();
  }
}
