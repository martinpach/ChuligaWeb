import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { GalleryAlbum } from '../../models';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent {
  @Input() album: GalleryAlbum;
  @Input() isAdmin: boolean;
  @Input() picturesForDeletion: string[];
  @Input() loading: boolean;
  @Output() onNavigateToParent = new EventEmitter<string>();
  @Output() onNavigateToChild = new EventEmitter<string>();
  @Output() onAddAlbum = new EventEmitter();
  @Output() onDeleteAlbum = new EventEmitter<GalleryAlbum>();
  @Output() onFilesSelected = new EventEmitter<any>();
  @Output() onDeleteImages = new EventEmitter();
  @Output() onPictureChecked = new EventEmitter<{ event: MatCheckboxChange; picture: string }>();

  constructor() {}
}
