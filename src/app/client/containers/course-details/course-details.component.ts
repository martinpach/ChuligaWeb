import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Course, ClientUser } from '../../../shared/models';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../shared/services/courses.service';
import { CoursesRegistrationService } from '../../services/courses-registration.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseDetailsComponent implements OnDestroy {
  course$: Observable<Course>;
  bookLoading = false;
  unbookLoading = false;
  loggedInUser: ClientUser;
  loggedInUserSubscription: Subscription;

  constructor(
    navigationService: NavigationService,
    route: ActivatedRoute,
    coursesService: CoursesService,
    private coursesRegistrationService: CoursesRegistrationService,
    authService: AuthService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    const id = route.snapshot.params['id'];
    this.course$ = coursesService.getCourse(id);
    navigationService.scrollBreakpoint.next(0);
    this.loggedInUserSubscription = authService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
      this.cd.markForCheck();
    });
  }

  async handleBookForCourse(course: Course) {
    if (this.bookLoading || this.unbookLoading) return;
    this.bookLoading = true;
    if (!this.loggedInUser) return this.router.navigate(['/auth']);
    try {
      await this.coursesRegistrationService.bookCourse(course, this.loggedInUser);
    } catch (e) {
      this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
    } finally {
      this.bookLoading = false;
      this.cd.markForCheck();
    }
    await swal(`Kurz ${course.heading} bol úspešne rezervovaný.`, 'Tešíme sa na vás.', 'success', {
      button: {
        className: 'swal-ok-button'
      }
    });
  }

  async handleUnbookForCourse(course: Course) {
    if (this.unbookLoading || this.bookLoading) return;
    this.unbookLoading = true;
    if (!this.loggedInUser) return this.router.navigate(['/auth']);
    const isUnbookAllowed = await swal(`Naozaj chcete zrušiť rezerváciu pre kurz ${course.heading}?`, {
      icon: 'warning',
      buttons: ['nie', 'áno'],
      dangerMode: true
    });
    if (!isUnbookAllowed) {
      this.unbookLoading = false;
      return this.cd.markForCheck();
    }
    try {
      await this.coursesRegistrationService.unbookCourse(course, this.loggedInUser);
    } catch (e) {
      this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
    } finally {
      this.unbookLoading = false;
      this.cd.markForCheck();
    }
    this.snackBar.open(`Rezervácia pre kurz "${course.heading}" bola úspešne zrušená!`, null, { duration: 5000 });
  }

  ngOnDestroy() {
    this.loggedInUserSubscription.unsubscribe();
  }
}
