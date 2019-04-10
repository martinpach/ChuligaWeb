import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contact, ImageInfo } from '../../../shared/models';
import { ContactsService } from '../../../shared/services/contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../material/services/dialog.service';
import { tap } from 'rxjs/operators';
import { ImageManipulationService } from '../../services/image-manipulation.service';

@Component({
  selector: 'app-admin-contacts-edit',
  templateUrl: './admin-contacts-edit.component.html',
  styleUrls: ['./admin-contacts-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminContactsEditComponent {
  id: string;
  contact$: Observable<Contact | {}>;
  isLoading = false;
  isError = false;
  isImageLoading = false;
  deletedImage: string;
  image: ImageInfo = {};
  deleteMessage = 'Naozaj chcete vymazať tento kontakt?';
  imgFolder = 'contacts/';

  constructor(
    private contactsService: ContactsService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService,
    private imgManipulationService: ImageManipulationService,
    private cd: ChangeDetectorRef
  ) {
    this.id = route.snapshot.params['id'];
    this.contact$ = this.id
      ? contactsService
          .getContact(this.id)
          .pipe(tap((item: Contact) => (this.image.fromServer = item && item.picture ? item.picture : undefined)))
      : of({});
  }

  get heading() {
    return !!this.id ? 'ÚPRAVA KONTAKTU' : 'NOVÝ KONTAKT';
  }

  async onSubmit(contact: Contact) {
    this.onAsync();
    let promises = [];
    if (this.image.currentUpload) {
      const processedImage = await this.imgManipulationService.resizeAndCompressImage(this.image.currentUpload.file, 500, 500);
      const uploadedImage = await this.fileService.upload(processedImage, this.imgFolder);

      contact = {
        ...contact,
        picture: await uploadedImage.ref.getDownloadURL()
      };
    }
    if (!this.id) {
      promises = [this.contactsService.addContact(contact)];
    } else {
      if (this.deletedImage && !this.image.currentUpload) {
        contact = {
          ...contact,
          picture: null
        };
      }
      const deleteImagePromise = this.deletedImage ? this.fileService.deleteByUrl(this.deletedImage) : Promise.resolve();
      const updateServiceItemPromise = this.contactsService.updateContact(this.id, contact);
      promises = [deleteImagePromise, updateServiceItemPromise];
    }

    Promise.all(promises)
      .then(() => this.router.navigate(['admin', 'contacts', 'list']))
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

  onContactDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        const deleteImagePromise = this.image.fromServer ? this.fileService.deleteByUrl(this.image.fromServer) : Promise.resolve();
        const deleteContactPromise = this.contactsService.deleteContact(this.id);
        Promise.all([deleteImagePromise, deleteContactPromise])
          .then(() => this.router.navigate(['admin', 'contacts', 'list']))
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
