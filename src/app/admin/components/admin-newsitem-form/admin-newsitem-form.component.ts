import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ImageInfo, NewsItem } from '../../../shared/models';
import { NgForm } from '@angular/forms';
import { wysiwygOptions } from '../../../shared/utils/wysiwyg-util';
import { addAttributeToIframe } from '../../utils';

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

  wysiwygOptions = wysiwygOptions;

  onSubmit(f: NgForm) {
    if (!f.value.heading || !this.newsItem.description) {
      this.isValid = false;
      return;
    }
    this.isValid = true;

    this.newsItem = {
      ...this.newsItem,
      heading: <string>f.value.heading,
      description: <string>addAttributeToIframe(this.newsItem.description, ' allowfullscreen '),
      shortDescription: <string>f.value.shortDescription || '',
      date: new Date()
    };
    this.submitted.emit(this.newsItem);
  }
}
