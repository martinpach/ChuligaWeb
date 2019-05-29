import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceItem, ImageInfo } from '../../../shared/models';
import { StagingsService } from '../../../shared/services/stagings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../material/services/dialog.service';
import { ImageManipulationService } from '../../services/image-manipulation.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-stagings-edit',
  templateUrl: './admin-stagings-edit.component.html',
  styleUrls: ['./admin-stagings-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminStagingsEditComponent {
  id: string;
  serviceItem$: Observable<ServiceItem | {}>;
  isLoading = false;
  isError = false;
  isImageLoading = false;
  isBgImageLoading = false;
  deletedImages: string[];
  images: ImageInfo[] = [];
  deletedBackgroundPicture: string;
  backgroundPicture: ImageInfo = {};
  deleteMessage = 'Naozaj chcete vymazať túto inscenáciu?';
  imgFolder = 'stagings/';

  constructor(
    private stagingsService: StagingsService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService,
    private imgManipulationService: ImageManipulationService,
    private cd: ChangeDetectorRef
  ) {
    this.id = route.snapshot.params['id'];
    this.serviceItem$ = this.id
      ? stagingsService.getStaging(this.id).pipe(
          tap((item: ServiceItem) => {
            this.images = item && item.pictures ? item.pictures.map(picture => ({ fromServer: picture })) : [];
            this.backgroundPicture.fromServer = item && item.backgroundPicture ? item.backgroundPicture : undefined;
          })
        )
      : of({});
  }

  get heading() {
    return !!this.id ? 'ÚPRAVA INSCENÁCIE' : 'NOVÁ INSCENÁCIA';
  }

  async onSubmit(serviceItem: ServiceItem) {
    this.onAsync();
    let promises = [];

    const processedImagesPromises = this.images
      .filter(({ currentUpload }) => currentUpload)
      .map(img => this.imgManipulationService.resizeAndCompressImage(img.currentUpload.file, 200, 200));

    const processedImages = await Promise.all(processedImagesPromises);

    const imageUploadPromises = processedImages.map(img => this.fileService.upload(img, this.imgFolder));

    let uploadedBackgroundPictureUrl;
    if (this.backgroundPicture && this.backgroundPicture.currentUpload) {
      const uploadedBackgroundPicture = await this.fileService.upload(this.backgroundPicture.currentUpload.file, this.imgFolder);
      uploadedBackgroundPictureUrl = await uploadedBackgroundPicture.ref.getDownloadURL();
    }

    const uploadedImages = await Promise.all(imageUploadPromises);
    const imgUrlsPromises = uploadedImages.map(img => img.ref.getDownloadURL());
    const imgUrls = await Promise.all(imgUrlsPromises);
    serviceItem = {
      ...serviceItem,
      pictures: [...(serviceItem.pictures || []), ...imgUrls],
      backgroundPicture: uploadedBackgroundPictureUrl || serviceItem.backgroundPicture || null
    };

    if (!this.id) {
      promises = [this.stagingsService.addStaging(serviceItem)];
    } else {
      serviceItem = {
        ...serviceItem,
        pictures: this.deletedImages
          ? serviceItem.pictures.filter(picture => this.deletedImages.indexOf(picture) === -1)
          : serviceItem.pictures,
        backgroundPicture: this.deletedBackgroundPicture ? null : serviceItem.backgroundPicture
      };

      let deleteImagePromises = this.deletedImages ? this.deletedImages.map(img => this.fileService.deleteByUrl(img)) : [Promise.resolve()];

      deleteImagePromises = this.deletedBackgroundPicture
        ? [...deleteImagePromises, this.fileService.deleteByUrl(this.deletedBackgroundPicture)]
        : deleteImagePromises;

      const updateServiceItemPromise = this.stagingsService.updateStaging(this.id, serviceItem);
      promises = [...deleteImagePromises, updateServiceItemPromise];
    }
    Promise.all(promises)
      .then(() => this.router.navigate(['admin', 'stagings', 'list']))
      .catch(() => this.onError());
  }

  onImageDelete(image: ImageInfo) {
    if (image.fromServer) {
      this.deletedImages = [...(this.deletedImages || []), image.fromServer];
      this.images = this.images.filter(({ fromServer }) => fromServer !== image.fromServer);
      return;
    }
    this.images = this.images.filter(({ currentUpload }) => !currentUpload || currentUpload.base64 !== image.currentUpload.base64);
  }

  onBackgroundPictureDelete(image: ImageInfo) {
    if (image.fromServer) {
      this.deletedBackgroundPicture = image.fromServer;
    }
    this.backgroundPicture = {};
  }

  async onImageUploaded(image: File) {
    const reader = new FileReader();
    this.isImageLoading = true;
    [image] = await this.imgManipulationService.fixImageRotation([image]);
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      this.images = [
        ...this.images,
        {
          currentUpload: {
            file: image,
            base64: reader.result
          }
        }
      ];
      this.isImageLoading = false;
      this.cd.markForCheck();
    };
  }

  async onBackgroundPictureUploaded(image: File) {
    const reader = new FileReader();
    this.isBgImageLoading = true;
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      this.backgroundPicture.currentUpload = {
        file: image,
        base64: reader.result
      };
      this.isBgImageLoading = false;
      this.cd.markForCheck();
    };
  }

  onServiceItemDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        let deleteImagePromises = this.images.map(img =>
          img.fromServer ? this.fileService.deleteByUrl(img.fromServer) : Promise.resolve()
        );
        if (this.backgroundPicture.fromServer) {
          deleteImagePromises = [...deleteImagePromises, this.fileService.deleteByUrl(this.backgroundPicture.fromServer)];
        }
        const deleteServiceItemPromise = this.stagingsService.deleteStaging(this.id);
        Promise.all([deleteImagePromises, deleteServiceItemPromise])
          .then(() => this.router.navigate(['admin', 'stagings', 'list']))
          .catch(() => this.onError());
      });
  }

  onError() {
    this.isError = true;
    this.isLoading = false;
  }

  onAsync() {
    this.isError = false;
    this.isLoading = true;
  }
}
