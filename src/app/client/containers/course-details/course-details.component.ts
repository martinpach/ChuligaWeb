import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Course, ClientUser } from '../../../shared/models';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../shared/services/courses.service';
import { CoursesRegistrationService } from '../../services/courses-registration.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import swal from 'sweetalert';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseDetailsComponent {
  course$: Observable<Course>;
  bookLoading = false;
  unbookLoading = false;
  loggedInUserSubscription: Subscription;
  loggedInUser$: Observable<ClientUser>;

  constructor(
    navigationService: NavigationService,
    route: ActivatedRoute,
    coursesService: CoursesService,
    private coursesRegistrationService: CoursesRegistrationService,
    authService: AuthService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) {
    const id = route.snapshot.params['id'];
    this.course$ = coursesService.getCourse(id);
    this.loggedInUser$ = authService.loggedInUser;
    navigationService.scrollBreakpoint.next(0);
  }

  async handleBookForCourse(course: Course, attendee: ClientUser) {
    if (this.bookLoading || this.unbookLoading) return;
    this.bookLoading = true;
    if (!attendee) return this.router.navigate(['/auth']);
    try {
      await this.coursesRegistrationService.bookCourse(course, attendee);
    } catch (e) {
      this.snackBar.open(`Niečo sa pokazilo. Skúste znova.`, null, { duration: 3000 });
    } finally {
      this.bookLoading = false;
      this.cd.markForCheck();
    }
    const opt: any = {
      button: {
        className: 'swal-ok-button'
      }
    };
    await swal(`Kurz ${course.heading} bol úspešne rezervovaný.`, 'Tešíme sa na vás.', 'success', { ...opt });
  }

  async handleUnbookForCourse(course: Course, attendee: ClientUser) {
    if (this.unbookLoading || this.bookLoading) return;
    this.unbookLoading = true;
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
  }

  isBookedForUser(loggedInUser: ClientUser, course: Course): boolean {
    return loggedInUser && loggedInUser.courses.indexOf(course.id) >= 0;
  }

  isSold(course: Course): boolean {
    return (course.capacity && course.attendees.length >= course.capacity) || course.deadlineDate < new Date();
  }
}
