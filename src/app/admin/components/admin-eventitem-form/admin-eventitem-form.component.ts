import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { EventItem, ImageInfo } from '../../../shared/models';
import { NgForm } from '@angular/forms';
import { wysiwygOptions } from '../../../shared/utils/wysiwyg-util';

@Component({
  selector: 'app-admin-eventitem-form',
  templateUrl: './admin-eventitem-form.component.html',
  styleUrls: ['./admin-eventitem-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEventitemFormComponent {
  isValid = true;
  wysiwygOptions = wysiwygOptions;

  @Input()
  image: any;

  @Input()
  eventItem: EventItem;

  @Input()
  isLoading: boolean = false;

  @Input()
  isError: boolean = false;

  @Output()
  submitted = new EventEmitter<EventItem>();

  @Output()
  imageDeleted = new EventEmitter<ImageInfo | any>();

  onSubmit(f: NgForm) {
    if (
      !f.value.heading ||
      !this.eventItem.description ||
      !this.eventItem.date ||
      (!f.value.hour && f.value.hour !== 0) ||
      (!f.value.minute && f.value.minute !== 0)
    ) {
      this.isValid = false;
      return;
    }
    this.isValid = true;

    this.eventItem;
    this.eventItem.date.setHours(f.value.hour);
    this.eventItem.date.setMinutes(parseInt(f.value.minute));

    this.eventItem = {
      ...this.eventItem,
      heading: <string>f.value.heading,
      description: <string>this.eventItem.description,
      date: this.eventItem.date,
      capacity: Math.abs(f.value.capacity) || null
    };

    this.submitted.emit(this.eventItem);
  }
}
