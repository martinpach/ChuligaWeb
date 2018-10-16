import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../shared/api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private api: ApiService, private router: Router) {}

  canActivate() {
    return this.api.isUserAdmin().pipe(
      map(isAdmin => {
        if (!isAdmin) return true;
        this.router.navigateByUrl('admin/home');
        return false;
      })
    );
  }
}
