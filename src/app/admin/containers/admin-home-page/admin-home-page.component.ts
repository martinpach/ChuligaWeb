import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  styleUrls: ['./admin-home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHomePageComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  onLogout() {
    this.auth.logout().then(() => this.router.navigate(['admin', 'login']));
  }
}
