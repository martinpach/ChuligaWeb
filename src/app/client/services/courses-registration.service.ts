import { Injectable } from '@angular/core';
import { ClientUser, Course } from '../../shared/models';
import { UsersService } from '../../shared/services/users.service';
import { CoursesService } from '../../shared/services/courses.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesRegistrationService {
  constructor(private coursesService: CoursesService, private usersService: UsersService) {}

  bookCourse(course: Course, attendee: ClientUser): Promise<any> {
    course.attendees = course.attendees || [];
    if (!course.capacity || course.capacity >= course.attendees.length + 1) {
      const updatedCourse: Course = { ...course, attendees: [...(course.attendees || []), attendee.id] };
      const updatedAttendee: ClientUser = { ...attendee, courses: [...(attendee.courses || []), course.id] };
      const courseUpdatePromise = this.coursesService.updateCourse(course.id, updatedCourse);
      const userUpdatePromise = this.usersService.updateUser(attendee.id, updatedAttendee);
      return Promise.all([courseUpdatePromise, userUpdatePromise]);
    }
    return Promise.reject();
  }

  unbookCourse(course: Course, attendee: ClientUser): Promise<any> {
    const updatedCourse: Course = { ...course, attendees: course.attendees.filter(a => a !== attendee.id) };
    const updatedAttendee: ClientUser = { ...attendee, courses: attendee.courses.filter(e => e !== course.id) };
    const courseUpdatePromise = this.coursesService.updateCourse(course.id, updatedCourse);
    const userUpdatePromise = this.usersService.updateUser(attendee.id, updatedAttendee);
    return Promise.all([courseUpdatePromise, userUpdatePromise]);
  }
}
