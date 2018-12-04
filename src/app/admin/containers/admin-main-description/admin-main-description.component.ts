import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MainDescriptionService } from '../../../shared/services/main-description.service';
import { MainDescription } from '../../../shared/models';
import { DialogService } from '../../../shared/services/dialog.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-admin-main-description',
  templateUrl: './admin-main-description.component.html',
  styleUrls: ['./admin-main-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminMainDescriptionComponent {
  mainDescription: MainDescription = { content: '' };
  isLoading = false;
  dialogMessage = 'Naozaj chcete uložiť zmeny?';

  constructor(
    private mainDescriptionService: MainDescriptionService,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {
    mainDescriptionService.getDescription().subscribe(description => {
      cd.markForCheck();
      this.mainDescription = description;
    });
  }

  onSave() {
    this.dialogService
      .openConfirmDialog(this.dialogMessage)
      .afterClosed()
      .subscribe(async (res: boolean) => {
        try {
          if (!res) return;
          this.isLoading = true;
          await this.mainDescriptionService.saveDescription(this.mainDescription);
          this.isLoading = false;
          this.snackBar.open('Zmeny boli uložené!', null, { duration: 2000 });
          this.cd.markForCheck();
        } catch (e) {
          this.snackBar.open('Niečo sa pokazilo. Skúste znova.', null, { duration: 3000 });
        }
      });
  }
}
