import { Component, Output, EventEmitter } from '@angular/core';
import { FileService } from '../services/files.service';
import { Upload, FileInfo } from '../models';
import * as firebase from 'firebase';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  currentUpload: Upload;
  @Output()
  fileUploaded = new EventEmitter<FileInfo>();

  constructor(private fileService: FileService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.currentUpload = new Upload(file);
    const uploadTask = this.fileService.upload(this.currentUpload);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) =>
        (this.currentUpload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (error: Error) => console.log(error),
      async () => {
        const fileUrl: string = await firebase
          .storage()
          .ref()
          .child(`uploads/${file.name}`)
          .getDownloadURL();

        this.fileUploaded.emit({ name: file.name, url: fileUrl });
      }
    );
  }
}
