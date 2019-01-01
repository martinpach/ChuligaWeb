import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryService } from '../../../shared/services/gallery.service';
import { GalleryAlbum } from '../../../shared/models';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../material/services/dialog.service';

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
  picturesForDeletion: string[];
  deleteImagesMessage = 'Naozaj chcete vymazať zvolené položky?';
  picturesFolder: string;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private galleryService: GalleryService,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {
    this.idSubscription = route.params.subscribe(({ id }) => {
      this.id = id || 'root';
      this.album$ = this.galleryService.getAlbum(this.id);
      this.picturesForDeletion = [];
      this.picturesFolder = `gallery/${this.id}/`;
    });
  }

  navigateToParent(id = 'root') {
    if (id === 'root') {
      this.router.navigate(['/admin', 'gallery']);
    } else {
      this.router.navigate(['/admin', 'gallery', id]);
    }
  }

  navigateToChild(id: string) {
    this.router.navigate(['/admin', 'gallery', id]);
  }

  pictureChecked({ event, picture }: any) {
    if (event.checked) {
      this.picturesForDeletion = [...this.picturesForDeletion, picture];
    } else {
      this.picturesForDeletion.splice(this.picturesForDeletion.indexOf(picture), 1);
    }
  }

  deleteImages() {
    this.dialogService
      .openConfirmDialog(this.deleteImagesMessage)
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        await this.galleryService.deleteImages(this.id, this.picturesForDeletion);
        this.picturesForDeletion.forEach(picture => this.fileService.deleteByUrl(picture));
        this.picturesForDeletion = [];
      });
  }

  deleteAlbum(album: GalleryAlbum) {
    if (this.id === 'root') return;
    if (album.childrens.length > 0) {
      this.snackBar.open('Album nie je možné vymazať! (Uistite sa že neobsahuje žiadne podalbumy)', null, { duration: 5000 });
      return;
    }
    this.dialogService
      .openConfirmDialog(`Naozaj chcete vymazat album "${album.name}"?`)
      .afterClosed()
      .subscribe(async (res: boolean) => {
        if (!res) return;
        await this.galleryService.deleteAlbum(this.id);
        await this.galleryService.deleteChild(album.parentId, `${album.name}:${this.id}`);
        album.pictures.forEach(this.fileService.deleteByUrl);
        this.navigateToParent();
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
          const addedAlbum = await this.galleryService.createAlbum(newAlbum);
          await this.galleryService.addChild(this.id, `${newAlbum.name}:${addedAlbum.id}`);
          this.snackBar.open('Album bol vytvorený!', null, { duration: 2000 });
        } catch (e) {
          this.snackBar.open('Niečo sa pokazilo. Skúste znova.', null, { duration: 3000 });
        }
      });
  }

  async uploadFiles(event: any) {
    this.loading = true;
    const fileList: FileList = event.target.files;
    let uploads: PromiseLike<any>[] = [];
    for (let i = 0; i < fileList.length; i++) {
      uploads = [...uploads, this.fileService.upload(fileList.item(i), this.picturesFolder)];
    }
    try {
      const uploadedImages = await Promise.all(uploads);
      const mappedImages: string[] = await Promise.all(
        uploadedImages.map(async (file: firebase.storage.UploadTaskSnapshot) => await file.ref.getDownloadURL())
      );
      this.galleryService.addImages(this.id, mappedImages);
    } catch (e) {
      this.snackBar.open('Niečo sa pokazilo. Skúste znova.', null, { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.idSubscription.unsubscribe();
  }
}
