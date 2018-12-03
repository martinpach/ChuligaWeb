import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GridWrapper } from '../../../shared/utils/grid-wrapper';
import { ServiceItem } from '../../../shared/models';
import { Observable } from 'rxjs';
import { ServicesService } from '../../../shared/services/services.service';
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';
import { FileService } from '../../../shared/services/files.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-services',
  templateUrl: './admin-services.component.html',
  styleUrls: ['./admin-services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminServicesListComponent extends GridWrapper {
  services$: Observable<ServiceItem[]>;
  selectedRows: any[] = [];
  columnDefs: ColDef[] = [
    { headerName: 'Názov', field: 'name', checkboxSelection: true, minWidth: 250, headerCheckboxSelection: true },
    { headerName: 'Kategória', field: 'category', suppressAutoSize: true, suppressSizeToFit: true, width: 100 },
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
    private servicesService: ServicesService,
    private router: Router,
    private dialogService: DialogService,
    private fileService: FileService
  ) {
    super(cd);
    this.services$ = this.servicesService.getServices().pipe(tap(console.log));
  }

  editClicked({ event, data }: CellClickedEvent) {
    const element: any = event.target;
    if (element.tagName === 'BUTTON') {
      this.router.navigate(['/admin', 'services', data.id, 'edit']);
    }
  }

  deleteClicked() {
    this.dialogService
      .openConfirmDialog('Naozaj chcete vymazať zvolené služby?')
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        await this.servicesService.deleteServices(this.selectedRows.map(row => row.id));
        this.selectedRows.forEach((row: ServiceItem) => {
          if (!row.picture || !row.picture.name) return;
          this.fileService.delete(row.picture.name);
        });
        this.gridOptions.api.deselectAll();
      });
  }
}
