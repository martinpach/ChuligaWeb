import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EventItem, ImageInfo } from '../../../shared/models';
import { Observable, of } from 'rxjs';
import { EventsService } from '../../../shared/services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../material/services/dialog.service';
import { tap, switchMap, map } from 'rxjs/operators';
import { ImageManipulationService } from '../../services/image-manipulation.service';
import { UsersService } from '../../../shared/services/users.service';

@Component({
  selector: 'app-admin-events-edit',
  templateUrl: './admin-events-edit.component.html',
  styleUrls: ['./admin-events-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEventsEditComponent {
  id: string;
  eventItem$: Observable<EventItem | {}>;
  isLoading = false;
  isError = false;
  isImageLoading = false;
  deletedImage: string;
  image: ImageInfo = {};
  deleteMessage = 'Naozaj chcete vymazať túto udalosť?';
  imgFolder = 'events/';

  constructor(
    private eventsService: EventsService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService,
    private imgManipulationService: ImageManipulationService,
    private cd: ChangeDetectorRef
  ) {
    this.id = route.snapshot.params['id'];
    this.eventItem$ = this.id
      ? eventsService.getEventItem(this.id).pipe(
          switchMap((item: EventItem) =>
            this.usersService.getUsersByIds(item.attendees).pipe(map(resolvedAttendees => ({ ...item, resolvedAttendees })))
          ),
          tap((item: EventItem) => (this.image.fromServer = item && item.picture ? item.picture : undefined))
        )
      : of({});
  }

  get heading() {
    return !!this.id ? 'ÚPRAVA UDALOSTI' : 'NOVÁ UDALOSŤ';
  }

  async onSubmit(eventItem: EventItem) {
    this.onAsync();
    let promises = [];
    if (this.image.currentUpload) {
      const { image, thumbnail } = await this.imgManipulationService.compressAndCreateThumbnail(this.image.currentUpload.file);
      const thumbnailUploadPromise = this.fileService.upload(thumbnail, this.imgFolder);
      const originalImageUploadPromise = this.fileService.upload(image, this.imgFolder);

      const uploadedImages = await Promise.all([originalImageUploadPromise, thumbnailUploadPromise]);
      eventItem = {
        ...eventItem,
        picture: (await uploadedImages[0].ref.getDownloadURL()) + ',' + (await uploadedImages[1].ref.getDownloadURL())
      };
    }
    if (!this.id) {
      promises = [this.eventsService.addEventItem(eventItem)];
    } else {
      if (this.deletedImage && !this.image.currentUpload) {
        eventItem = {
          ...eventItem,
          picture: null
        };
      }
      const deleteImagePromises = this.deletedImage ? this.deletedImage.split(',').map(this.fileService.deleteByUrl) : [Promise.resolve()];
      const updateEventItemPromise = this.eventsService.updateEventItem(this.id, eventItem);
      promises = [...deleteImagePromises, updateEventItemPromise];
    }

    Promise.all(promises)
      .then(() => this.router.navigate(['admin', 'events', 'list']))
      .catch(() => this.onError());
  }

  onImageDelete() {
    if (this.image.fromServer) {
      this.deletedImage = this.image.fromServer;
    }
    this.image = {};
  }

  async onImageUploaded(image: File) {
    const reader = new FileReader();
    this.isImageLoading = true;
    [image] = await this.imgManipulationService.fixImageRotation([image]);
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      this.image.currentUpload = {
        file: image,
        base64: reader.result
      };
      this.isImageLoading = false;
      this.cd.markForCheck();
    };
  }

  onEventItemDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        const deleteImagePromises = this.image.fromServer
          ? this.image.fromServer.split(',').map(this.fileService.deleteByUrl)
          : [Promise.resolve()];
        const deleteEventItemPromise = this.eventsService.deleteEventItem(this.id);
        Promise.all([...deleteImagePromises, deleteEventItemPromise])
          .then(() => this.router.navigate(['admin', 'events', 'list']))
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
