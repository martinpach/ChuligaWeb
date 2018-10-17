import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AdminAuthService } from '../services/admin-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginGuard implements CanActivate {
  constructor(private adminAuth: AdminAuthService, private router: Router) {}

  canActivate() {
    return this.adminAuth.isAdmin.pipe(
      map(isAdmin => {
        isAdmin && this.router.navigateByUrl('admin');
        return !isAdmin;
      })
    );
  }
}
