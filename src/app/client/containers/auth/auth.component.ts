import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClientUser } from '../../../shared/models';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { DialogService } from '../../../material/services/dialog.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  registrationInProcess = false;
  loginInProcess = false;
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogService: DialogService
  ) {}

  async onGoogleLogin() {
    await this.authService.providerLogin(new firebase.auth.GoogleAuthProvider());
    this.router.navigate(['/']);
  }

  async onLoginSubmit(f: NgForm) {
    if (!f.valid) return;
    this.loginInProcess = true;
    try {
      await this.authService.emailLogin(f.value.email, f.value.password);
      this.loginInProcess = false;
      this.router.navigate(['/']);
    } catch (e) {
      this.loginInProcess = false;
      this.snackBar.open(e, null, { duration: 4000 });
    }
  }

  async onRegistrationSubmit(f: NgForm) {
    if (!f.valid) return;
    const user: ClientUser = {
      email: f.value.email,
      displayName: f.value.firstName + ' ' + f.value.lastName
    };

    try {
      this.registrationInProcess = true;
      await this.authService.emailSignUp(user, f.value.password);
      this.registrationInProcess = false;
      f.resetForm();
      this.snackBar.open('Registrácia prebehla úspešne. Na uvedenú emailovú adresu obdržíte aktivačný link.', null, { duration: 15000 });
    } catch (e) {
      this.registrationInProcess = false;
      this.snackBar.open(e, null, { duration: 5000 });
    }
  }

  resetPassword() {
    this.dialogService
      .openPasswordResetDialog()
      .afterClosed()
      .subscribe(async (email: string) => {
        if (!email) return;
        await this.authService.resetPassword(email);
        this.snackBar.open('Na email vám bol zaslaný link pre obnovenie hesla.', null, { duration: 5000 });
      });
  }
}
