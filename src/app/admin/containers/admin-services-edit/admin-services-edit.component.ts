import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ServiceItem, ImageInfo } from '../../../shared/models';
import { Observable, of } from 'rxjs';
import { ServicesService } from '../../../shared/services/services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../material/services/dialog.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-services-edit',
  templateUrl: './admin-services-edit.component.html',
  styleUrls: ['./admin-services-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminServicesEditComponent {
  id: string;
  serviceItem$: Observable<ServiceItem | {}>;
  isLoading = false;
  isError = false;
  deletedImages: string[];
  images: ImageInfo[] = [];
  deleteMessage = 'Naozaj chcete vymazať túto službu?';
  imgFolder = 'services/';

  constructor(
    private servicesService: ServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService
  ) {
    this.id = route.snapshot.params['id'];
    this.serviceItem$ = this.id
      ? servicesService
          .getServiceItem(this.id)
          .pipe(
            tap((item: ServiceItem) => (this.images = item && item.pictures ? item.pictures.map(picture => ({ fromServer: picture })) : []))
          )
      : of({});
  }

  get heading() {
    return !!this.id ? 'ÚPRAVA SLUŽY' : 'NOVÁ SLUŽBA';
  }

  async onSubmit(serviceItem: ServiceItem) {
    this.onAsync();
    let promises = [];
    const imageUploadPromises = this.images
      .filter(({ currentUpload }) => currentUpload)
      .map(img => this.fileService.upload(img.currentUpload.file, this.imgFolder));

    const uploadedImages = await Promise.all(imageUploadPromises);
    const imgUrlsPromises = uploadedImages.map(img => img.ref.getDownloadURL());
    const imgUrls = await Promise.all(imgUrlsPromises);
    serviceItem = {
      ...serviceItem,
      pictures: [...(serviceItem.pictures || []), ...imgUrls]
    };

    if (!this.id) {
      promises = [this.servicesService.addServiceItem(serviceItem)];
    } else {
      serviceItem = {
        ...serviceItem,
        pictures: this.deletedImages
          ? serviceItem.pictures.filter(picture => this.deletedImages.indexOf(picture) === -1)
          : serviceItem.pictures
      };

      const deleteImagePromises = this.deletedImages
        ? this.deletedImages.map(img => this.fileService.deleteByUrl(img))
        : [Promise.resolve()];

      const updateServiceItemPromise = this.servicesService.updateServiceItem(this.id, serviceItem);
      promises = [...deleteImagePromises, updateServiceItemPromise];
    }
    Promise.all(promises)
      .then(() => this.router.navigate(['admin', 'services', 'list']))
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

  onImageUploaded(image: File) {
    const reader = new FileReader();
    reader.onloadend = () =>
      (this.images = [
        ...this.images,
        {
          currentUpload: {
            file: image,
            base64: reader.result
          }
        }
      ]);

    reader.readAsDataURL(image);
  }

  onServiceItemDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        const deleteImagePromises = this.images.map(img =>
          img.fromServer ? this.fileService.deleteByUrl(img.fromServer) : Promise.resolve()
        );
        const deleteServiceItemPromise = this.servicesService.deleteServiceItem(this.id);
        Promise.all([deleteImagePromises, deleteServiceItemPromise])
          .then(() => this.router.navigate(['admin', 'services', 'list']))
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
