import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { wysiwygOptions } from '../../../shared/utils/wysiwyg-util';
import { Course, ImageInfo, CourseCategory } from '../../../shared/models';
import { NgForm } from '@angular/forms';
import { addAttributeToIframe } from '../../utils';

@Component({
  selector: 'app-admin-course-form',
  templateUrl: './admin-course-form.component.html',
  styleUrls: ['./admin-course-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCourseFormComponent {
  isValid = true;
  wysiwygOptions = wysiwygOptions;
  categories = [
    {
      label: 'Kreatívne školy pre deti',
      value: CourseCategory.KS
    },
    {
      label: 'Všeobecné',
      value: CourseCategory.GENERAL
    }
  ];

  @Input()
  image: any;

  @Input()
  course: Course;

  @Input()
  isLoading: boolean = false;

  @Input()
  isError: boolean = false;

  @Output()
  submitted = new EventEmitter<Course>();

  @Output()
  imageDeleted = new EventEmitter<ImageInfo | any>();

  onSubmit(f: NgForm) {
    if (!f.value.heading || !this.course.description || !this.course.deadlineDate) {
      this.isValid = false;
      return;
    }
    this.isValid = true;

    this.course = {
      ...this.course,
      heading: <string>f.value.heading,
      shortDescription: <string>f.value.shortDescription || '',
      description: <string>addAttributeToIframe(this.course.description, ' allowfullscreen '),
      deadlineDate: this.course.deadlineDate,
      displayDate: this.course.displayDate || this.course.deadlineDate,
      capacity: Math.abs(f.value.capacity) || null,
      category: f.value.category || CourseCategory.GENERAL
    };

    this.submitted.emit(this.course);
  }
}
