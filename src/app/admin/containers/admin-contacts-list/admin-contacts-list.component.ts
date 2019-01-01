import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { DialogService } from '../../../material/services/dialog.service';
import { FileService } from '../../../shared/services/files.service';
import { GridWrapper } from '../../../shared/utils/grid-wrapper';
import { Contact } from '../../../shared/models';
import { ContactsService } from '../../../shared/services/contacts.service';

@Component({
  selector: 'app-admin-contacts-list',
  templateUrl: './admin-contacts-list.component.html',
  styleUrls: ['./admin-contacts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminContactsListComponent extends GridWrapper {
  contacts$: Observable<Contact[]>;
  selectedRows: any[] = [];
  columnDefs: ColDef[] = [
    {
      headerName: 'Meno',
      field: 'firstName',
      suppressAutoSize: true,
      suppressSizeToFit: true,
      checkboxSelection: true,
      minWidth: 150,
      headerCheckboxSelection: true
    },
    { headerName: 'Priezvisko', field: 'lastName', minWidth: 250 },
    {
      headerName: 'Akcia',
      field: 'action',
      cellRenderer: () => '<button class="edit-button">Uprav</button>',
      onCellClicked: this.editClicked.bind(this),
      suppressSorting: true,
      suppressFilter: true,
      suppressAutoSize: true,
      suppressSizeToFit: true,
      width: 70
    }
  ];

  constructor(
    cd: ChangeDetectorRef,
    private contactsService: ContactsService,
    private router: Router,
    private dialogService: DialogService,
    private fileService: FileService
  ) {
    super(cd);
    this.contacts$ = this.contactsService.getContacts();
  }

  editClicked({ event, data }: CellClickedEvent) {
    const element: any = event.target;
    if (element.tagName === 'BUTTON') {
      this.router.navigate(['/admin', 'contacts', data.id, 'edit']);
    }
  }

  deleteClicked() {
    this.dialogService
      .openConfirmDialog('Naozaj chcete vymazať zvolené kontakty?')
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        await this.contactsService.deleteContacts(this.selectedRows.map(row => row.id));
        this.selectedRows.forEach((row: Contact) => {
          if (!row.picture || !row.picture.name) return;
          this.fileService.delete(row.picture.name, 'contacts/');
        });
        this.gridOptions.api.deselectAll();
      });
  }
}
