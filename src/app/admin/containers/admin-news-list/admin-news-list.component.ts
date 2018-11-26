import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NewsItem } from '../../../shared/models';
import { Observable } from 'rxjs';
import { NewsService } from '../../../shared/services/news.service';
import { ColDef, GridOptions, CellClickedEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-admin-news-list',
  templateUrl: './admin-news-list.component.html',
  styleUrls: ['./admin-news-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsListComponent {
  news$: Observable<NewsItem[]>;
  selectedRows: any[] = [];
  columnDefs: ColDef[] = [
    { headerName: 'Nadpis', field: 'heading', checkboxSelection: true, minWidth: 250, headerCheckboxSelection: true },
    { headerName: 'Dátum', field: 'date', suppressAutoSize: true, suppressSizeToFit: true, width: 100 },
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
    private newsService: NewsService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService
  ) {
    this.news$ = this.newsService.getNews(ref => ref.orderBy('date', 'desc'));
  }

  editClicked({ event, data }: CellClickedEvent) {
    const element: any = event.target;
    if (element.tagName === 'BUTTON') {
      this.router.navigate(['/admin', 'news', data.id, 'edit']);
    }
  }

  onSelection() {
    this.selectedRows = this.gridOptions.api.getSelectedRows();
    this.cd.markForCheck();
  }

  deleteClicked() {
    this.dialogService
      .openConfirmDialog('Naozaj chcete vymazat zvolené aktuality?')
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        await this.newsService.deleteNews(this.selectedRows.map(row => row.id));
        this.selectedRows.forEach((row: NewsItem) => {
          if (!row.picture || !row.picture.name) return;
          this.fileService.delete(row.picture.name);
        });
        this.gridOptions.api.deselectAll();
      });
  }
}
