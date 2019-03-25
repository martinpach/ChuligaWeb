import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { EventItem } from '../../../shared/models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService } from '../../../material/services/dialog.service';
import { FileService } from '../../../shared/services/files.service';
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import { dateComparator, dateRenderer } from '../../../shared/utils/items-util';
import { GridWrapper } from '../../../shared/utils/grid-wrapper';

@Component({
  selector: 'app-admin-events-list',
  templateUrl: './admin-events-list.component.html',
  styleUrls: ['./admin-events-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEventsListComponent extends GridWrapper {
  events$: Observable<EventItem[]>;
  columnDefs: ColDef[] = [
    { headerName: 'Nadpis', field: 'heading', checkboxSelection: true, minWidth: 250, headerCheckboxSelection: true },
    { headerName: 'Kategória', field: 'category', suppressAutoSize: true, suppressSizeToFit: true, width: 100 },
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
      cellRenderer: ({ data }) => (data.attendees && data.attendees.length ? data.attendees.length : '0'),
      suppressSizeToFit: true,
      width: 100,
      cellClass: ({ data }) => (data.capacity && data.attendees && data.capacity - data.attendees.length <= 5 ? 'warn-text' : '')
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

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private dialogService: DialogService,
    private fileService: FileService,
    cd: ChangeDetectorRef
  ) {
    super(cd);
    this.events$ = eventsService.getEvents(ref => ref.orderBy('date', 'asc').startAt(new Date()));
  }

  editClicked({ event, data }: CellClickedEvent) {
    const element: any = event.target;
    if (element.tagName === 'BUTTON') {
      this.router.navigate(['/admin', 'events', data.id, 'edit']);
    }
  }

  deleteClicked() {
    this.dialogService
      .openConfirmDialog('Naozaj chcete vymazať zvolené udalosti?')
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        await this.eventsService.deleteEvents(this.selectedRows.map(row => row.id));
        this.selectedRows.forEach((row: EventItem) => {
          if (!row.picture) return;
          const pics = row.picture.split(',');
          pics.forEach(pic => this.fileService.deleteByUrl(pic));
        });
        this.gridOptions.api.deselectAll();
      });
  }
}
