import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { GridWrapper } from '../../../shared/utils/grid-wrapper';
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import { dateComparator, dateRenderer } from '../../../shared/utils/items-util';
import { Router } from '@angular/router';
import { DialogService } from '../../../material/services/dialog.service';
import { FileService } from '../../../shared/services/files.service';
import { Course } from '../../../shared/models';
import { CoursesService } from '../../../shared/services/courses.service';

@Component({
  selector: 'app-admin-courses-list',
  templateUrl: './admin-courses-list.component.html',
  styleUrls: ['./admin-courses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCoursesListComponent extends GridWrapper {
  courses$: Observable<Course[]>;
  columnDefs: ColDef[] = [
    { headerName: 'Nadpis', field: 'heading', checkboxSelection: true, minWidth: 250, headerCheckboxSelection: true },
    { headerName: 'Kategória', field: 'category', suppressAutoSize: true, suppressSizeToFit: true, width: 90 },
    {
      headerName: 'Dátum prihlasovania',
      field: 'deadlineDate',
      comparator: dateComparator,
      cellRenderer: dateRenderer('dd.MM.yyyy'),
      suppressAutoSize: true,
      suppressSizeToFit: true,
      width: 155,
      cellClass: ({ data }) => (data.deadlineDate.toDate() < new Date() ? 'warn-text' : '')
    },
    {
      headerName: 'Dátum zobrazovania',
      field: 'displayDate',
      comparator: dateComparator,
      cellRenderer: dateRenderer('dd.MM.yyyy'),
      suppressAutoSize: true,
      suppressSizeToFit: true,
      width: 150,
      cellClass: ({ data }) => (data.deadlineDate.toDate() < new Date() ? 'warn-text' : '')
    },
    { headerName: 'Kapacita', field: 'capacity', suppressAutoSize: true, suppressSizeToFit: true, width: 90 },
    {
      headerName: 'Nahlásení',
      field: 'attendees.length',
      suppressAutoSize: true,
      cellRenderer: ({ data }) => (data.attendees && data.attendees.length ? data.attendees.length : '0'),
      suppressSizeToFit: true,
      width: 90,
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
    private coursesService: CoursesService,
    private router: Router,
    private dialogService: DialogService,
    private fileService: FileService,
    cd: ChangeDetectorRef
  ) {
    super(cd);
    this.courses$ = coursesService.getCourses(ref => ref.orderBy('displayDate', 'asc'));
  }

  editClicked({ event, data }: CellClickedEvent) {
    const element: any = event.target;
    if (element.tagName === 'BUTTON') {
      this.router.navigate(['/admin', 'courses', data.id, 'edit']);
    }
  }

  deleteClicked() {
    this.dialogService
      .openConfirmDialog('Naozaj chcete vymazať zvolené kurzy?')
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        await this.coursesService.deleteCourses(this.selectedRows.map(row => row.id));
        this.selectedRows.forEach((row: Course) => {
          if (!row.picture) return;
          const pics = row.picture.split(',');
          pics.forEach(pic => this.fileService.deleteByUrl(pic));
        });
        this.gridOptions.api.deselectAll();
      });
  }
}
