import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ServiceItem, ServerImageInfo, ImageInfo } from '../../../shared/models';
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
  deletedImage: ServerImageInfo;
  image: ImageInfo = {};
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
          .pipe(tap((item: ServiceItem) => (this.image.fromServer = item && item.picture ? item.picture : undefined)))
      : of({});
  }

  get heading() {
    return !!this.id ? 'ÚPRAVA SLUŽY' : 'NOVÁ SLUŽBA';
  }

  async onSubmit(serviceItem: ServiceItem) {
    this.onAsync();
    let promises = [];
    if (this.image.currentUpload) {
      const uploadedImage = await this.fileService.upload(this.image.currentUpload.file, this.imgFolder);
      serviceItem = {
        ...serviceItem,
        picture: {
          url: await uploadedImage.ref.getDownloadURL(),
          name: uploadedImage.metadata.name
        }
      };
    }
    if (!this.id) {
      promises = [this.servicesService.addServiceItem(serviceItem)];
    } else {
      if (this.deletedImage) {
        serviceItem = {
          ...serviceItem,
          picture: null
        };
      }
      const deleteImagePromise = this.deletedImage ? this.fileService.delete(this.deletedImage.name, this.imgFolder) : Promise.resolve();
      const updateServiceItemPromise = this.servicesService.updateServiceItem(this.id, serviceItem);
      promises = [deleteImagePromise, updateServiceItemPromise];
    }

    Promise.all(promises)
      .then(() => this.router.navigate(['admin', 'services', 'list']))
      .catch(() => this.onError());
  }

  onImageDelete() {
    if (this.image.fromServer) {
      this.deletedImage = this.image.fromServer;
    }
    this.image = {};
  }

  onImageUploaded(image: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.image.currentUpload = {
        file: image,
        base64: reader.result
      };
    };
    reader.readAsDataURL(image);
  }

  onServiceItemDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        const deleteImagePromise = this.image.fromServer
          ? this.fileService.delete(this.image.fromServer.name, this.imgFolder)
          : Promise.resolve();
        const deleteServiceItemPromise = this.servicesService.deleteServiceItem(this.id);
        Promise.all([deleteImagePromise, deleteServiceItemPromise])
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
