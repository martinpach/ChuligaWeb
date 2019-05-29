import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-page-map',
  templateUrl: './page-map.component.html',
  styleUrls: ['./page-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageMapComponent implements OnInit {
  ngOnInit() {}
}
