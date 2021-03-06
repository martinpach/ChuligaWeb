import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ServiceItem, ImageInfo, ServiceCategory } from '../../../shared/models';
import { wysiwygOptions } from '../../../shared/utils/wysiwyg-util';
import { NgForm } from '@angular/forms';
import { addAttributeToIframe } from '../../utils';

@Component({
  selector: 'app-admin-serviceitem-form',
  templateUrl: './admin-serviceitem-form.component.html',
  styleUrls: ['./admin-serviceitem-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminServiceitemFormComponent {
  isValid = true;

  @Input()
  image: any;

  @Input()
  serviceItem: ServiceItem;

  @Input()
  isLoading: boolean = false;

  @Input()
  isError: boolean = false;

  @Output()
  submitted = new EventEmitter<ServiceItem>();

  @Output()
  imageDeleted = new EventEmitter<ImageInfo | any>();

  wysiwygOptions = wysiwygOptions;

  categories = [
    {
      label: 'Pre firmy',
      value: ServiceCategory.C
    },
    {
      label: 'Pre školy',
      value: ServiceCategory.S
    },
    {
      label: 'Kreatíva',
      value: ServiceCategory.K
    }
  ];

  onSubmit(f: NgForm) {
    if (!f.value.name || !this.serviceItem.description) {
      this.isValid = false;
      return;
    }
    this.isValid = true;

    this.serviceItem = {
      ...this.serviceItem,
      name: <string>f.value.name,
      description: <string>addAttributeToIframe(this.serviceItem.description, ' allowfullscreen '),
      category: f.value.category || ServiceCategory.K
    };
    this.submitted.emit(this.serviceItem);
  }
}
