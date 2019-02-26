import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { wysiwygOptions } from '../../../shared/utils/wysiwyg-util';
import { Course, ImageInfo, EventCategory } from '../../../shared/models';
import { NgForm } from '@angular/forms';

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
      label: 'Dom kreativity',
      value: EventCategory.DK
    },
    {
      label: 'Montessori',
      value: EventCategory.MONTESSORI
    },
    {
      label: 'Rodinné centrum',
      value: EventCategory.RC
    },
    {
      label: 'Všeobecné',
      value: EventCategory.GENERAL
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
      description: <string>this.course.description,
      deadlineDate: this.course.deadlineDate,
      displayDate: this.course.displayDate || this.course.deadlineDate,
      capacity: Math.abs(f.value.capacity) || null,
      category: f.value.category || EventCategory.GENERAL
    };

    this.submitted.emit(this.course);
  }
}
