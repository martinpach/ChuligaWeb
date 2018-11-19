import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EventItem, ServerImageInfo, ImageInfo } from '../../../shared/models';
import { Observable, of } from 'rxjs';
import { EventsService } from '../../../shared/services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-events-edit',
  templateUrl: './admin-events-edit.component.html',
  styleUrls: ['./admin-events-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
//TODO: very similar to news
export class AdminEventsEditComponent {
  id: string;
  eventItem$: Observable<EventItem | {}>;
  isLoading = false;
  isError = false;
  deletedImage: ServerImageInfo;
  image: ImageInfo = {};
  deleteMessage = 'Naozaj chcete vymazať túto udalosť?';

  constructor(
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService
  ) {
    this.id = route.snapshot.params['id'];
    this.eventItem$ = this.id
      ? eventsService
          .getEventItem(this.id)
          .pipe(tap((item: EventItem) => (this.image.fromServer = item && item.picture ? item.picture : undefined)))
      : of({});
  }

  get heading() {
    return !!this.id ? 'ÚPRAVA UDALOSTI' : 'NOVÁ UDALOSŤ';
  }

  async onSubmit(eventItem: EventItem) {
    this.onAsync();
    let promises = [];
    if (this.image.currentUpload) {
      const uploadedImage = await this.fileService.upload(this.image.currentUpload.file);
      eventItem = {
        ...eventItem,
        picture: {
          url: await uploadedImage.ref.getDownloadURL(),
          name: uploadedImage.metadata.name
        }
      };
    }
    if (!this.id) {
      promises = [this.eventsService.addEventItem(eventItem)];
    } else {
      if (this.deletedImage) {
        eventItem = {
          ...eventItem,
          picture: null
        };
      }
      const deleteImagePromise = this.deletedImage ? this.fileService.delete(this.deletedImage.name) : Promise.resolve();
      const updateEventItemPromise = this.eventsService.updateEventItem(this.id, eventItem);
      promises = [deleteImagePromise, updateEventItemPromise];
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

  onEventItemDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        const deleteImagePromise = this.image.fromServer ? this.fileService.delete(this.image.fromServer.name) : Promise.resolve();
        const deleteEventItemPromise = this.eventsService.deleteEventItem(this.id);
        Promise.all([deleteImagePromise, deleteEventItemPromise])
          .then(() => this.router.navigate(['admin', 'news', 'list']))
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
