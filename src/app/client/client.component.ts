import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientComponent {
  loggedInUser$: Observable<User>;
  constructor(private authService: AuthService) {
    this.loggedInUser$ = authService.loggedInUser;
  }

  async logout() {
    await this.authService.logout();
  }
}
