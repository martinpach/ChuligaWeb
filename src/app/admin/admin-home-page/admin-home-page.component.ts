import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  styleUrls: ['./admin-home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHomePageComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit() {}
}
