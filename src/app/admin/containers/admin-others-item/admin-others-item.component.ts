import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { OthersItem } from '../../../shared/models';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { OthersService } from '../../../shared/services/others.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '../../../material/services/dialog.service';

@Component({
  selector: 'app-admin-others-item',
  templateUrl: './admin-others-item.component.html',
  styleUrls: ['./admin-others-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminOthersItemComponent {
  othersItem$: Observable<OthersItem | {}>;
  isLoading = false;
  isError = false;
  id: string;
  dialogMessage = 'Naozaj chcete uložiť zmeny?';

  constructor(
    private router: Router,
    private othersService: OthersService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef
  ) {
    this.id = route.snapshot.params['id'];
    this.othersItem$ = othersService.getOthersItem(this.id);
  }

  get heading() {
    switch (this.id) {
      case 'houseOfCreativity':
        return 'Dom kreativity';
      case 'theater':
        return 'Divadlo Haliganda';
      case 'mainDescription':
        return 'Hlavný popis stránky';
      default:
        return 'Kreatívne školy pre deti';
    }
  }

  async onSubmit(othersItem: OthersItem) {
    this.dialogService
      .openConfirmDialog(this.dialogMessage)
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        this.isLoading = true;
        this.cd.markForCheck();
        try {
          await this.othersService.save(this.id, othersItem);
          this.isLoading = false;
          this.cd.markForCheck();
          this.snackBar.open('Zmeny boli uložené!', null, { duration: 2000 });
        } catch (e) {
          this.snackBar.open('Niečo sa pokazilo. Skúste znova.', null, { duration: 3000 });
        }
      });
  }
}
