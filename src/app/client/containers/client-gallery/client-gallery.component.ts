import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { GalleryAlbum } from '../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryService } from '../../../shared/services/gallery.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-client-gallery',
  templateUrl: './client-gallery.component.html',
  styleUrls: ['./client-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientGalleryComponent implements OnDestroy {
  id: string;
  idSubscription: Subscription;
  album$: Observable<GalleryAlbum>;
  picturesFolder: string;

  constructor(
    private route: ActivatedRoute,
    private galleryService: GalleryService,
    private router: Router,
    navigationService: NavigationService
  ) {
    this.idSubscription = route.params.subscribe(({ id }) => {
      this.id = id || 'root';
      this.album$ = this.galleryService.getAlbum(this.id);
      this.picturesFolder = `gallery/${this.id}/`;
    });
    navigationService.scrollBreakpoint.next(0);
  }

  navigateToParent(id = 'root') {
    if (id === 'root') {
      this.router.navigate(['/gallery']);
    } else {
      this.router.navigate(['/gallery', id]);
    }
  }

  navigateToChild(id: string) {
    this.router.navigate(['/gallery', id]);
  }

  ngOnDestroy() {
    this.idSubscription.unsubscribe();
  }
}
