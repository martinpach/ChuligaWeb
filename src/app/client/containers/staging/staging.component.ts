import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ServiceItem } from '../../../shared/models';
import { Observable } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { StagingsService } from '../../../shared/services/stagings.service';

@Component({
  selector: 'app-staging',
  templateUrl: './staging.component.html',
  styleUrls: ['./staging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StagingComponent {
  stagings$: Observable<ServiceItem[]>;
  servicesCategory: string;

  constructor(navigationService: NavigationService, stagingsService: StagingsService, route: ActivatedRoute) {
    navigationService.scrollBreakpoint.next(0);
    this.servicesCategory = route.snapshot.params['category'];
    this.stagings$ = stagingsService.getStagings();
  }

  trackByFn(index: number) {
    return index;
  }
}
