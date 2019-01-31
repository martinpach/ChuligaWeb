import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHomePageComponent {
  constructor(private auth: AdminAuthService, private router: Router) {
    router.navigate(['admin', 'news', 'list']);
  }

  onLogout() {
    this.auth.logout().then(() => this.router.navigate(['admin', 'login']));
  }
}
