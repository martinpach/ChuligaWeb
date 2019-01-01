import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contact, ServerImageInfo, ImageInfo } from '../../../shared/models';
import { ContactsService } from '../../../shared/services/contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { tap } from 'rxjs/operators';

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
  deletedImage: ServerImageInfo;
  image: ImageInfo = {};
  deleteMessage = 'Naozaj chcete vymazať tento kontakt?';
  imgFolder = 'contacts/';

  constructor(
    private contactsService: ContactsService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService
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
      const uploadedImage = await this.fileService.upload(this.image.currentUpload.file, this.imgFolder);
      contact = {
        ...contact,
        picture: {
          url: await uploadedImage.ref.getDownloadURL(),
          name: uploadedImage.metadata.name
        }
      };
    }
    if (!this.id) {
      promises = [this.contactsService.addContact(contact)];
    } else {
      if (this.deletedImage) {
        contact = {
          ...contact,
          picture: null
        };
      }
      const deleteImagePromise = this.deletedImage ? this.fileService.delete(this.deletedImage.name, this.imgFolder) : Promise.resolve();
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

  onContactDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        const deleteImagePromise = this.image.fromServer
          ? this.fileService.delete(this.image.fromServer.name, this.imgFolder)
          : Promise.resolve();
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
