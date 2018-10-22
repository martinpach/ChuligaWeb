import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
