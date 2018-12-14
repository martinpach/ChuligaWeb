import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryService } from '../../../shared/services/gallery.service';
import { GalleryAlbum, ServerImageInfo } from '../../../shared/models';
import { Observable, Subscription } from 'rxjs';
import { MatCheckboxChange, MatSnackBar } from '@angular/material';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-admin-gallery',
  templateUrl: './admin-gallery.component.html',
  styleUrls: ['./admin-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminGalleryComponent implements OnDestroy {
  id: string;
  idSubscription: Subscription;
  album$: Observable<GalleryAlbum>;
  picturesForDeletion: { [key: string]: ServerImageInfo } = { a: { name: 'sdas', url: 'fsafa' } };
  deleteMessage = 'Naozaj chcete vymazať zvolené položky?';

  constructor(
    private route: ActivatedRoute,
    private galleryService: GalleryService,
    private router: Router,
    private fileService: FileService,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {
    this.idSubscription = route.params.subscribe(({ id }) => {
      this.id = id || 'root';
      this.album$ = this.galleryService.getAlbum(this.id);
      this.picturesForDeletion = {};
    });
  }

  navigateToParent(id = 'root') {
    if (id === 'root') {
      this.router.navigate(['/admin', 'gallery']);
    } else {
      this.router.navigate(['/admin', 'gallery', id]);
    }
  }

  isEmpty(obj: Object) {
    return !Object.keys(obj).length;
  }

  pictureChecked(event: MatCheckboxChange, picture: ServerImageInfo) {
    if (event.checked) {
      this.picturesForDeletion = {
        ...this.picturesForDeletion,
        [picture.name]: picture
      };
    } else {
      delete this.picturesForDeletion[picture.name];
    }
  }

  deleteImages(originalPictures: ServerImageInfo[]) {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        const filteredPictures = originalPictures.filter(picture => !this.picturesForDeletion[picture.name]);
        await this.galleryService.updateImages(this.id, filteredPictures);
        await Object.keys(this.picturesForDeletion).forEach(key => this.fileService.delete(key));
        this.picturesForDeletion = {};
        this.cd.markForCheck();
      });
  }

  addAlbum() {
    this.dialogService
      .openNewAlbumDialog()
      .afterClosed()
      .subscribe(async (albumName: string) => {
        if (!albumName) return;
        const newAlbum: GalleryAlbum = {
          name: albumName,
          parentId: this.id,
          childrens: [],
          pictures: []
        };
        try {
          await this.galleryService.createAlbum(newAlbum);
          this.snackBar.open('Album bol vytvorený!', null, { duration: 2000 });
        } catch (e) {
          this.snackBar.open('Niečo sa pokazilo. Skúste znova.', null, { duration: 3000 });
        }
      });
  }

  ngOnDestroy() {
    this.idSubscription.unsubscribe();
  }
}
