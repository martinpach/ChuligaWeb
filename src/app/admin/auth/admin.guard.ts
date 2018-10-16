import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private api: ApiService, private router: Router) {}

  canActivate() {
    return this.api.isUserAdmin().pipe(
      map(isAdmin => {
        if (isAdmin) return true;
        this.router.navigateByUrl('admin');
        return false;
      })
    );
  }
}
