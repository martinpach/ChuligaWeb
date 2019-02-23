import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Course, ClientUser } from '../../../shared/models';
import { CoursesService } from '../../../shared/services/courses.service';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { tap, switchMap, take } from 'rxjs/operators';
import { CoursesRegistrationService } from '../../services/courses-registration.service';

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
  bookLoading = false;
  unbookLoading = false;

  constructor(
    private coursesService: CoursesService,
    navigationService: NavigationService,
    authService: AuthService,
    private router: Router,
    private coursesRegistrationService: CoursesRegistrationService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {
    this.loggedInUser$ = authService.loggedInUser;
    this.courses$ = this.loadMore.pipe(
      tap(() => (this.isLoadingCourses = true)),
      switchMap((_, index) =>
        coursesService
          .getCourses(ref =>
            ref
              .orderBy('deadlineDate', 'asc')
              .limit(this.limit * (index + 1))
              .startAt(new Date())
          )
          .pipe(tap(news => (this.coursesLength = news.length)))
      ),
      tap(() => (this.isLoadingCourses = false))
    );
    this.coursesCount$ = coursesService.getCoursesCount();
    navigationService.scrollBreakpoint.next(0);
  }

  handleBookForCourse(course: Course) {
    if (this.bookLoading || this.unbookLoading) return;
    this.bookLoading = true;
    this.loggedInUser$.pipe(take(1)).subscribe(async attendee => {
      if (!attendee) return this.router.navigate(['/auth']);
      try {
        await this.coursesRegistrationService.bookCourse(course, attendee);
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
    });
  }

  handleUnbookForCourse(course: Course) {
    if (this.unbookLoading || this.bookLoading) return;
    this.unbookLoading = true;
    this.loggedInUser$.pipe(take(1)).subscribe(async attendee => {
      if (!attendee) return this.router.navigate(['/auth']);
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
        await this.coursesRegistrationService.unbookCourse(course, attendee);
      } catch (e) {
        this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
      } finally {
        this.unbookLoading = false;
        this.cd.markForCheck();
      }
      this.snackBar.open(`Rezervácia pre kurz "${course.heading}" bola úspešne zrušená!`, null, { duration: 5000 });
    });
  }

  navigateToCourseDetails(course: Course) {
    this.router.navigate(['/courses', course.id]);
  }

  trackByFn(index: number) {
    return index;
  }
}
