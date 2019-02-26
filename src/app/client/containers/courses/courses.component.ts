import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Course, ClientUser } from '../../../shared/models';
import { CoursesService } from '../../../shared/services/courses.service';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { tap, switchMap, publishReplay, refCount, publish, take } from 'rxjs/operators';
import { CoursesRegistrationService } from '../../services/courses-registration.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent {
  courses$: Observable<Course[]>;
  coursesCount$: Observable<number>;
  loadMore = new BehaviorSubject(null);
  isLoadingCourses = false;
  coursesLength = 0;
  limit = 5;
  loggedInUser$: Observable<ClientUser>;
  loadingId: string = null;

  constructor(
    private coursesService: CoursesService,
    navigationService: NavigationService,
    authService: AuthService,
    private router: Router,
    private coursesRegistrationService: CoursesRegistrationService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {
    this.loggedInUser$ = authService.loggedInUser.pipe(
      publish(),
      refCount()
    );
    this.courses$ = this.loadMore.pipe(
      tap(() => (this.isLoadingCourses = true)),
      switchMap((_, index) =>
        coursesService
          .getCourses(ref =>
            ref
              .orderBy('displayDate', 'asc')
              .limit(this.limit * (index + 1))
              .startAt(new Date())
          )
          .pipe(tap(courses => (this.coursesLength = courses.length)))
      ),
      tap(() => (this.isLoadingCourses = false)),
      publish(),
      refCount()
    );
    this.coursesCount$ = coursesService.getCoursesCount();
    navigationService.scrollBreakpoint.next(0);
  }

  handleBookForCourse(course: Course, attendee: ClientUser) {
    if (!attendee) return this.router.navigate(['/auth']);
    this.loadingId = course.id;
    this.coursesRegistrationService
      .bookCourse(course, attendee)
      .then()
      .catch(() => {
        this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
        this.loadingId = null;
      });

    combineLatest(this.courses$, this.loggedInUser$)
      .pipe(take(1))
      .subscribe(() => {
        const opt: any = {
          button: {
            className: 'swal-ok-button'
          }
        };
        this.loadingId = null;
        swal(`Kurz ${course.heading} bol úspešne rezervovaný.`, 'Tešíme sa na vás.', 'success', { ...opt });
      });
  }

  async handleUnbookForCourse(course: Course, attendee: ClientUser) {
    if (!attendee) return this.router.navigate(['/auth']);
    const isUnbookAllowed = await swal(`Naozaj chcete zrušiť rezerváciu pre kurz ${course.heading}?`, {
      icon: 'warning',
      buttons: ['nie', 'áno'],
      dangerMode: true
    });
    if (!isUnbookAllowed) return;
    this.loadingId = course.id;
    this.coursesRegistrationService
      .unbookCourse(course, attendee)
      .then()
      .catch(() => {
        this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
        this.loadingId = null;
      });
    combineLatest(this.courses$, this.loggedInUser$)
      .pipe(take(1))
      .subscribe(() => {
        this.loadingId = null;
        this.snackBar.open(`Rezervácia pre kurz "${course.heading}" bola úspešne zrušená!`, null, { duration: 5000 });
      });
  }

  navigateToCourseDetails(course: Course) {
    this.router.navigate(['/courses', course.id]);
  }

  isBookedForUser(loggedInUser: ClientUser, { id }: Course): boolean {
    return loggedInUser && loggedInUser.courses.indexOf(id) >= 0;
  }

  trackByFn(index: number) {
    return index;
  }
}
