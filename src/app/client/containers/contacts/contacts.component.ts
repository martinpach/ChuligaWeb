import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ContactsService } from '../../../shared/services/contacts.service';
import { Contact } from '../../../shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent {
  contacts$: Observable<Contact[]>;

  constructor(navigationService: NavigationService, contactsService: ContactsService) {
    this.contacts$ = contactsService.getContacts(contacts => contacts.orderBy('order', 'asc'));
    navigationService.scrollBreakpoint.next(0);
  }
}
