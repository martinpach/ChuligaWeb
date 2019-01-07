import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-picture-card',
  templateUrl: './picture-card.component.html',
  styleUrls: ['./picture-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictureCardComponent {
  @Input() heading: string;
  @Input() description: string;
  @Input() imagePath: string;
  @Output() moreClicked = new EventEmitter();
}
