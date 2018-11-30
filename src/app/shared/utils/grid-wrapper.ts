import { GridOptions } from 'ag-grid-community';
import { ChangeDetectorRef } from '@angular/core';

export abstract class GridWrapper {
  constructor(protected cd: ChangeDetectorRef) {}

  selectedRows: any[] = [];
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

  onSelection() {
    this.selectedRows = this.gridOptions.api.getSelectedRows();
    this.cd.markForCheck();
  }
}
