import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Contact, ImageInfo } from '../../../shared/models';
import { wysiwygOptions } from '../../../shared/utils/wysiwyg-util';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-contact-form',
  templateUrl: './admin-contact-form.component.html',
  styleUrls: ['./admin-contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminContactFormComponent {
  isValid = true;

  @Input()
  image: any;

  @Input()
  contact: Contact;

  @Input()
  isLoading: boolean = false;

  @Input()
  isError: boolean = false;

  @Output()
  submitted = new EventEmitter<Contact>();

  @Output()
  imageDeleted = new EventEmitter<ImageInfo | any>();

  wysiwygOptions = wysiwygOptions;

  onSubmit(f: NgForm) {
    if (!f.value.firstName || !this.contact.description || !f.value.lastName || !f.value.email || !f.value.phone) {
      this.isValid = false;
      return;
    }
    this.isValid = true;

    this.contact = {
      ...this.contact,
      firstName: <string>f.value.firstName,
      lastName: <string>f.value.lastName,
      email: <string>f.value.email,
      phone: <string>f.value.phone,
      description: <string>this.contact.description,
      order: <number>f.value.order || null
    };
    this.submitted.emit(this.contact);
  }
}
