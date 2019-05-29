import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { EventItem, ImageInfo, EventCategory } from '../../../shared/models';
import { NgForm } from '@angular/forms';
import { wysiwygOptions } from '../../../shared/utils/wysiwyg-util';
import { addAttributeToIframe } from '../../utils';

@Component({
  selector: 'app-admin-eventitem-form',
  templateUrl: './admin-eventitem-form.component.html',
  styleUrls: ['./admin-eventitem-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEventitemFormComponent {
  isValid = true;
  wysiwygOptions = wysiwygOptions;
  categories = [
    {
      label: 'Dom kreativity',
      value: EventCategory.DK
    },
    {
      label: 'Divadlo Haliganda',
      value: EventCategory.DH
    },
    {
      label: 'Kreatívne školy pre deti',
      value: EventCategory.KS
    },
    {
      label: 'Všeobecné',
      value: EventCategory.GENERAL
    }
  ];

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

    this.eventItem.date.setHours(f.value.hour);
    this.eventItem.date.setMinutes(parseInt(f.value.minute));

    this.eventItem = {
      ...this.eventItem,
      heading: <string>f.value.heading,
      shortDescription: <string>f.value.shortDescription || '',
      description: <string>addAttributeToIframe(this.eventItem.description, ' allowfullscreen '),
      date: this.eventItem.date,
      capacity: Math.abs(f.value.capacity) || null,
      category: f.value.category || EventCategory.GENERAL
    };

    this.submitted.emit(this.eventItem);
  }
}
