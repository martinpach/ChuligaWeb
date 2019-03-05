import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-services-navigation',
  templateUrl: './services-navigation.component.html',
  styleUrls: ['./services-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesNavigationComponent implements OnInit {
  constructor(navigationService: NavigationService) {
    navigationService.scrollBreakpoint.next(0);
  }

  ngOnInit() {}
}
