import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NewsService } from '../../../shared/services/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsItem, ImageInfo } from '../../../shared/models';
import { Observable } from 'rxjs';
import { FileService } from '../../../shared/services/files.service';
import { tap } from 'rxjs/operators';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-admin-news-edit',
  templateUrl: './admin-news-edit.component.html',
  styleUrls: ['./admin-news-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsEditComponent {
  id: string;
  newsItem$: Observable<NewsItem>;
  newsItem: NewsItem;
  isLoading = false;
  isError = false;
  deletedImage: ImageInfo;
  deleteMessage = 'Naozaj chcete vymazať túto aktualitu?';

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService
  ) {
    this.id = route.snapshot.params['id'];
    this.newsItem$ = newsService.getNewsItem(this.id).pipe(tap(newsItem => (this.newsItem = newsItem)));
  }

  onSubmit(newsItem: NewsItem) {
    this.onAsync();

    const deleteImagePromise = this.deletedImage ? this.fileService.delete(this.deletedImage.name) : Promise.resolve();
    const updateNewsItemPromise = this.newsService.updateNewsItem({ id: this.id, ...newsItem });

    Promise.all([deleteImagePromise, updateNewsItemPromise])
      .then(() => this.router.navigate(['admin', 'news', 'list']))
      .catch(() => this.onError());
  }

  onImageDeleted(imageInfo: ImageInfo) {
    this.deletedImage = imageInfo;
  }

  onNewsItemDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        const deleteImagePromise = this.newsItem.picture.name ? this.fileService.delete(this.newsItem.picture.name) : Promise.resolve();
        const deleteNewsItemPromise = this.newsService.deleteNewsItem(this.id);
        Promise.all([deleteImagePromise, deleteNewsItemPromise])
          .then(() => this.router.navigate(['admin', 'news', 'list']))
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
