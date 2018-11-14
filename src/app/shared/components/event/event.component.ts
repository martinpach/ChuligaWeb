import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { EventItem } from '../../models';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventComponent {
  @Input()
  event: EventItem;

  @Input()
  overlayText: string;

  @Input()
  isClient: boolean;

  @Input()
  isWarn: boolean;
}
