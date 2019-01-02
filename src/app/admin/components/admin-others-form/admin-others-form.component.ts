import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { OthersItem } from '../../../shared/models';
import { wysiwygOptions } from '../../../shared/utils/wysiwyg-util';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-others-form',
  templateUrl: './admin-others-form.component.html',
  styleUrls: ['./admin-others-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminOthersFormComponent {
  wysiwygOptions = wysiwygOptions;

  @Input()
  othersItem: OthersItem = { description: '', shortDescription: '' };

  @Input()
  isLoading: boolean;

  @Output()
  submitted = new EventEmitter<OthersItem>();

  constructor() {
    this.othersItem = { description: 'serus', shortDescription: 'nazdar' };
  }

  onSubmit(f: NgForm) {
    this.othersItem = {
      ...this.othersItem,
      description: <string>this.othersItem.description,
      shortDescription: <string>f.value.shortDescription || ''
    };
    this.submitted.emit(this.othersItem);
  }
}
