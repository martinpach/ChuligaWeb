import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { EventItem } from '../../../shared/models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';
import { FileService } from '../../../shared/services/files.service';
import { ColDef, GridOptions, CellClickedEvent } from 'ag-grid-community';
import { dateComparator, dateRenderer } from '../../../shared/utils/items-util';

@Component({
  selector: 'app-admin-events-list',
  templateUrl: './admin-events-list.component.html',
  styleUrls: ['./admin-events-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// TODO: similar to news
export class AdminEventsListComponent {
  events$: Observable<EventItem[]>;
  selectedRows: any[] = [];
  columnDefs: ColDef[] = [
    { headerName: 'Nadpis', field: 'heading', checkboxSelection: true, minWidth: 250, headerCheckboxSelection: true },
    {
      headerName: 'Dátum',
      field: 'date',
      comparator: dateComparator,
      cellRenderer: dateRenderer('dd.MM.yyyy HH:mm'),
      suppressAutoSize: true,
      suppressSizeToFit: true,
      width: 150
    },
    { headerName: 'Kapacita', field: 'capacity', suppressAutoSize: true, suppressSizeToFit: true, width: 100 },
    {
      headerName: 'Nahlásení',
      field: 'attendees.length',
      suppressAutoSize: true,
      suppressSizeToFit: true,
      width: 100,
      cellClass: ({ data }) => (data.capacity - data.attendees.length <= 5 ? 'warn-text' : '')
    },
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

  gridOptions: GridOptions = {
    onGridSizeChanged: event => event.api.sizeColumnsToFit(),
    enableSorting: true,
    enableFilter: true,
    domLayout: 'autoHeight',
    suppressCellSelection: true,
    rowSelection: 'multiple',
    onSelectionChanged: this.onSelection.bind(this),
    enableColResize: true
  };

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private dialogService: DialogService,
    private fileService: FileService,
    private cd: ChangeDetectorRef
  ) {
    this.events$ = eventsService.getEvents(ref => ref.orderBy('date', 'asc').startAt(new Date()));
  }

  editClicked({ event, data }: CellClickedEvent) {
    const element: any = event.target;
    if (element.tagName === 'BUTTON') {
      this.router.navigate(['/admin', 'events', data.id, 'edit']);
    }
  }

  onSelection() {
    this.selectedRows = this.gridOptions.api.getSelectedRows();
    this.cd.markForCheck();
  }

  deleteClicked() {
    this.dialogService
      .openConfirmDialog('Naozaj chcete vymazať zvolené udalosti?')
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        await this.eventsService.deleteEvents(this.selectedRows.map(row => row.id));
        this.selectedRows.forEach((row: EventItem) => {
          if (!row.picture || !row.picture.name) return;
          this.fileService.delete(row.picture.name);
        });
        this.gridOptions.api.deselectAll();
      });
  }
}
