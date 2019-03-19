import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ServiceItem } from '../../../shared/models';

@Component({
  selector: 'app-service-item',
  templateUrl: './service-item.component.html',
  styleUrls: ['./service-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceItemComponent {
  @Input() serviceItem: ServiceItem;
}
