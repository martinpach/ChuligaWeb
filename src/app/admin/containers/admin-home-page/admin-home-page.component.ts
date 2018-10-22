import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  styleUrls: ['./admin-home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHomePageComponent {
  constructor(private auth: AuthService, private router: Router) {
    router.navigate(['admin', 'news']);
  }

  onLogout() {
    this.auth.logout().then(() => this.router.navigate(['admin', 'login']));
  }
}
