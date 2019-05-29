import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceItem } from '../../../shared/models';
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import { StagingsService } from '../../../shared/services/stagings.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../material/services/dialog.service';
import { FileService } from '../../../shared/services/files.service';
import { GridWrapper } from '../../../shared/utils/grid-wrapper';

@Component({
  selector: 'app-admin-stagings',
  templateUrl: './admin-stagings.component.html',
  styleUrls: ['./admin-stagings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminStagingsComponent extends GridWrapper {
  stagings$: Observable<ServiceItem[]>;
  selectedRows: any[] = [];
  columnDefs: ColDef[] = [
    { headerName: 'Názov', field: 'name', checkboxSelection: true, minWidth: 250, headerCheckboxSelection: true },
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
    private stagingsService: StagingsService,
    private router: Router,
    private dialogService: DialogService,
    private fileService: FileService
  ) {
    super(cd);
    this.stagings$ = this.stagingsService.getStagings();
  }

  editClicked({ event, data }: CellClickedEvent) {
    const element: any = event.target;
    if (element.tagName === 'BUTTON') {
      this.router.navigate(['/admin', 'stagings', data.id, 'edit']);
    }
  }

  deleteClicked() {
    this.dialogService
      .openConfirmDialog('Naozaj chcete vymazať zvolené inscenácie?')
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        await this.stagingsService.deleteStagings(this.selectedRows.map(row => row.id));
        this.selectedRows.forEach((row: ServiceItem) => {
          this.fileService.deleteByUrl(row.backgroundPicture);
          row.pictures.forEach(picture => this.fileService.deleteByUrl(picture));
        });
        this.gridOptions.api.deselectAll();
      });
  }
}
