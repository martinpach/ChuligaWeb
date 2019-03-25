import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ImageManipulationService } from '../../../admin/services/image-manipulation.service';

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

  constructor(private imgManipulationService: ImageManipulationService) {}

  async onFileSelected(event: any) {
    this.fileUploaded.emit(event.target.files[0]);
  }
}
