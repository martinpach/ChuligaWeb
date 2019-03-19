import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ContactsService } from '../../../shared/services/contacts.service';
import { Contact } from '../../../shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent {
  contacts$: Observable<Contact[]>;

  constructor(navigationService: NavigationService, contactsService: ContactsService, domSanitizer: DomSanitizer) {
    this.contacts$ = contactsService
      .getContacts(contacts => contacts.orderBy('order', 'asc'))
      .pipe(
        map(contacts =>
          contacts.map(contact => ({ ...contact, description: <string>domSanitizer.bypassSecurityTrustHtml(contact.description) }))
        )
      );
    navigationService.scrollBreakpoint.next(0);
  }
}
