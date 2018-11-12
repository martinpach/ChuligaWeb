import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  @Input()
  loading: boolean;

  @Output()
  fileUploaded = new EventEmitter<File>();

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.fileUploaded.emit(file);
  }
}
