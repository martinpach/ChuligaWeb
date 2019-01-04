import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-page-description',
  templateUrl: './page-description.component.html',
  styleUrls: ['./page-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageDescriptionComponent {
  @Input() description: SafeHtml;
}
