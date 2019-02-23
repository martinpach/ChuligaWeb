import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Course, ClientUser } from '../../../shared/models';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent {
  @Input() itemData: Course;
  @Input() loggedInUser: ClientUser;
  @Input() bookLoading: boolean;
  @Input() unbookLoading: boolean;
  @Output() bookClicked = new EventEmitter();
  @Output() unbookClicked = new EventEmitter();
  @Output() readMoreClicked = new EventEmitter();
}
