import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NewsService } from '../../../shared/services/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsItem, ImageInfo, ServerImageInfo } from '../../../shared/models';
import { Observable, of } from 'rxjs';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../material/services/dialog.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-news-edit',
  templateUrl: './admin-news-edit.component.html',
  styleUrls: ['./admin-news-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsEditComponent {
  id: string;
  newsItem$: Observable<NewsItem | {}>;
  isLoading = false;
  isError = false;
  deletedImage: ServerImageInfo;
  image: ImageInfo = {};
  deleteMessage = 'Naozaj chcete vymazať túto aktualitu?';
  imgFolder = 'news/';

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService
  ) {
    this.id = route.snapshot.params['id'];
    this.newsItem$ = this.id
      ? newsService
          .getNewsItem(this.id)
          .pipe(tap((item: NewsItem) => (this.image.fromServer = item && item.picture ? item.picture : undefined)))
      : of({});
  }

  get heading() {
    return !!this.id ? 'ÚPRAVA AKTUALITY' : 'NOVÁ AKTUALITA';
  }

  async onSubmit(newsItem: NewsItem) {
    this.onAsync();
    let promises = [];
    if (this.image.currentUpload) {
      const uploadedImage = await this.fileService.upload(this.image.currentUpload.file, this.imgFolder);
      newsItem = {
        ...newsItem,
        picture: {
          url: await uploadedImage.ref.getDownloadURL(),
          name: uploadedImage.metadata.name
        }
      };
    }
    if (!this.id) {
      promises = [this.newsService.addNewsItem(newsItem)];
    } else {
      if (this.deletedImage) {
        newsItem = {
          ...newsItem,
          picture: null
        };
      }
      const deleteImagePromise = this.deletedImage ? this.fileService.delete(this.deletedImage.name, this.imgFolder) : Promise.resolve();
      const updateNewsItemPromise = this.newsService.updateNewsItem(this.id, newsItem);
      promises = [deleteImagePromise, updateNewsItemPromise];
    }

    Promise.all(promises)
      .then(() => this.router.navigate(['admin', 'news', 'list']))
      .catch(() => this.onError());
  }

  onImageDelete() {
    if (this.image.fromServer) {
      this.deletedImage = this.image.fromServer;
    }
    this.image = {};
  }

  onImageUploaded(image: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.image.currentUpload = {
        file: image,
        base64: reader.result
      };
    };
    reader.readAsDataURL(image);
  }

  onNewsItemDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        const deleteImagePromise = this.image.fromServer
          ? this.fileService.delete(this.image.fromServer.name, this.imgFolder)
          : Promise.resolve();
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
