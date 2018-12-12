import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryService } from '../../../shared/services/gallery.service';
import { GalleryAlbum } from '../../../shared/models';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-gallery',
  templateUrl: './admin-gallery.component.html',
  styleUrls: ['./admin-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminGalleryComponent implements OnDestroy {
  id: string;
  idSubscription: Subscription;
  album$: Observable<GalleryAlbum>;

  constructor(private route: ActivatedRoute, private galleryService: GalleryService, private router: Router) {
    this.idSubscription = route.params.subscribe(({ id }) => {
      this.id = id || 'root';
      this.album$ = this.galleryService.getAlbum(this.id);
    });
  }

  navigateToParent(id = 'root') {
    if (id === 'root') {
      this.router.navigate(['/admin', 'gallery']);
    } else {
      this.router.navigate(['/admin', 'gallery', id]);
    }
  }

  ngOnDestroy() {
    this.idSubscription.unsubscribe();
  }
}
