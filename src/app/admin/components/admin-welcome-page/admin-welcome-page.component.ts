import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-welcome-page',
  templateUrl: './admin-welcome-page.component.html',
  styleUrls: ['./admin-welcome-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminWelcomePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
