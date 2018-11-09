import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileService } from '../../../shared/services/files.service';
import { NewsService } from '../../../shared/services/news.service';
import { NewsItem, ImageInfo } from '../../../shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-news-new',
  templateUrl: './admin-news-new.component.html',
  styleUrls: ['./admin-news-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsNewComponent implements OnInit {
  description: string;
  imageInfo: ImageInfo;
  isLoading = false;
  isValid: boolean;
  isError: boolean;

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

  constructor(private fileService: FileService, private newsService: NewsService, private router: Router) {}

  ngOnInit() {}

  onImageClick() {
    this.fileService.delete(this.imageInfo.name);
    this.imageInfo = undefined;
  }

  onImageUploaded(imageInfo: ImageInfo) {
    this.imageInfo = imageInfo;
  }

  onSubmit(f: NgForm) {
    this.isError = false;
    if (!f.value.heading || !this.description) {
      this.isValid = false;
      return;
    }
    this.isValid = true;

    const newsItem: NewsItem = {
      heading: <string>f.value.heading,
      description: <string>this.description,
      picture: <ImageInfo>this.imageInfo || { name: '', url: '' },
      shortDescription: <string>f.value.shortDescription || '',
      date: new Date()
    };
    this.isLoading = true;
    this.newsService
      .addNewsItem(newsItem)
      .then(() => {
        this.router.navigate(['admin', 'news', 'list']);
        this.isLoading = false;
      })
      .catch(() => (this.isError = true));
  }
}
