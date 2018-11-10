import { Component, ChangeDetectionStrategy } from '@angular/core';
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
export class AdminNewsNewComponent {
  isLoading = false;
  isError = false;
  newsItem = {};

  constructor(private fileService: FileService, private newsService: NewsService, private router: Router) {}

  onImageDeleted(imageInfo: ImageInfo) {
    this.fileService.delete(imageInfo.name).catch(() => this.onError());
  }

  onSubmit(newsItem: NewsItem) {
    this.onAsync();

    this.newsService
      .addNewsItem(newsItem)
      .then(() => {
        this.router.navigate(['admin', 'news', 'list']);
      })
      .catch(() => this.onError());
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
