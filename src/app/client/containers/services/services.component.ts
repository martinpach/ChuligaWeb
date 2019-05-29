import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ServicesService } from '../../../shared/services/services.service';
import { Observable } from 'rxjs';
import { ServiceItem, ServiceCategory } from '../../../shared/models';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent {
  services$: Observable<ServiceItem[]>;
  servicesCategory: string;
  categoriesMapping: { [key: string]: ServiceCategory } = {
    forCompanies: ServiceCategory.C,
    forSchools: ServiceCategory.S,
    creatives: ServiceCategory.K
  };

  constructor(navigationService: NavigationService, servicesService: ServicesService, route: ActivatedRoute) {
    navigationService.scrollBreakpoint.next(0);
    this.servicesCategory = route.snapshot.params['category'];
    this.services$ = servicesService
      .getServices()
      .pipe(map(services => services.filter(service => service.category === this.categoriesMapping[this.servicesCategory])));
  }

  trackByFn(index: number) {
    return index;
  }
}
