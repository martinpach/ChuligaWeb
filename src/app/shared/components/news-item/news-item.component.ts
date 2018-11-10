import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NewsItem } from '../../models';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsItemComponent {
  @Input()
  itemData: NewsItem;

  @Input()
  overlayText: string = 'ČÍTAJ VIAC';

  constructor() {}
}
