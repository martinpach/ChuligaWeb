import { Component, Output, EventEmitter, Input } from '@angular/core';
import { fixImageRotation } from '../../../admin/utils';

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

  async onFileSelected(event: any) {
    const file = await fixImageRotation([event.target.files[0]]);
    this.fileUploaded.emit(...file);
  }
}
