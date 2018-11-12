import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ImageInfo, NewsItem } from '../../../shared/models';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-newsitem-form',
  templateUrl: './admin-newsitem-form.component.html',
  styleUrls: ['./admin-newsitem-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsitemFormComponent {
  isValid = true;

  @Input()
  image: any;

  @Input()
  newsItem: NewsItem;

  @Input()
  isLoading: boolean = false;

  @Input()
  isError: boolean = false;

  @Output()
  submitted = new EventEmitter<NewsItem>();

  @Output()
  imageDeleted = new EventEmitter<ImageInfo | any>();

  wysiwygOptions = {
    editable: true,
    height: 'auto',
    minHeight: '150px',
    width: 'auto',
    minWidth: '150px',
    enableToolbar: true,
    showToolbar: true,
    toolbar: [
      ['bold', 'italic', 'underline', 'strikeThrough'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
      ['horizontalLine', 'orderedList', 'unorderedList'],
      ['link', 'video']
    ]
  };

  onSubmit(f: NgForm) {
    if (!f.value.heading || !this.newsItem.description) {
      this.isValid = false;
      return;
    }
    this.isValid = true;

    this.newsItem = {
      ...this.newsItem,
      heading: <string>f.value.heading,
      description: <string>this.newsItem.description,
      shortDescription: <string>f.value.shortDescription || '',
      date: new Date()
    };
    this.submitted.emit(this.newsItem);
  }
}
