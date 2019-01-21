import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { NewsItem } from '../../../shared/models';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsItemComponent {
  @Input() itemData: NewsItem;

  @Input() overlayText: string = 'ČÍTAJ VIAC';

  @Output() clicked = new EventEmitter();

  constructor() {}
}
