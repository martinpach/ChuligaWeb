import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../../shared/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  areCredentialsValid: boolean = true;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.value.email || !form.value.email) {
      return (this.areCredentialsValid = false);
    }
    this.api
      .loginAdmin(form.value.email, form.value.password)
      .subscribe(({ verified }) => {
        if (verified) {
          this.areCredentialsValid = true;
          form.reset();
          this.router.navigate(['home'], { relativeTo: this.route });
        } else {
          this.areCredentialsValid = false;
        }
      });
  }
}
