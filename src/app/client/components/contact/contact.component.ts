import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Contact } from '../../../shared/models';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  @Input() contact: Contact;

  constructor() {}
}
