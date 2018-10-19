import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  areCredentialsValid: boolean = true;

  constructor(
    private adminAuth: AdminAuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.value.email || !form.value.password) {
      return (this.areCredentialsValid = false);
    }
    this.adminAuth
      .login(form.value.email, form.value.password)
      .subscribe(isVerified => {
        if (isVerified) {
          this.areCredentialsValid = true;
          form.reset();
          this.router.navigate(['admin']);
        } else {
          this.areCredentialsValid = false;
        }
        this.cd.markForCheck();
      });
  }
}
