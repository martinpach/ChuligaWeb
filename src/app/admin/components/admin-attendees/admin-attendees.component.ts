import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { GridWrapper } from '../../../shared/utils/grid-wrapper';
import { ColDef } from 'ag-grid-community';
import { ClientUser } from '../../../shared/models';

@Component({
  selector: 'app-admin-attendees',
  templateUrl: './admin-attendees.component.html',
  styleUrls: ['./admin-attendees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAttendeesComponent extends GridWrapper {
  @Input() attendees: ClientUser[];
  selectedRows: any[] = [];
  columnDefs: ColDef[] = [
    {
      headerName: 'Email',
      field: 'email',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      minWidth: 200
    },
    {
      headerName: 'Meno',
      field: 'displayName',
      minWidth: 200
    }
  ];

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  exportEmails() {
    this.gridOptions.api.exportDataAsCsv({ onlySelected: true, skipHeader: true, columnKeys: ['email'] });
  }
}
