import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { tap, take } from 'rxjs/operators';
import { AdminAuthService } from '../services/admin-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private adminAuth: AdminAuthService, private router: Router) {}

  canActivate() {
    return this.adminAuth.isAdmin.pipe(
      tap(isAdmin => {
        !isAdmin && this.router.navigate(['admin', 'login']);
      })
    );
  }
}
