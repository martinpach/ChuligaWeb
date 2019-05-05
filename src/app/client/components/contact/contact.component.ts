import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Contact } from '../../../shared/models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  @Input() contact: Contact;

  constructor(public domSanitizer: DomSanitizer) {}
}
