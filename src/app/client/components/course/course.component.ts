import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Course, ClientUser } from '../../../shared/models';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent {
  @Input() itemData: Course;
  @Input() isBooked: boolean;
  @Input() loading: boolean;
  @Output() bookClicked = new EventEmitter();
  @Output() unbookClicked = new EventEmitter();
  @Output() readMoreClicked = new EventEmitter();

  isSold(): boolean {
    return this.itemData.capacity && this.itemData.attendees.length >= this.itemData.capacity;
  }

  handleClick() {
    this.isBooked ? this.unbookClicked.emit() : this.bookClicked.emit();
  }
}
