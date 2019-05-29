import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { OthersItem } from '../../../shared/models';
import { wysiwygOptions } from '../../../shared/utils/wysiwyg-util';
import { NgForm } from '@angular/forms';
import { addAttributeToIframe } from '../../utils';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-others-form',
  templateUrl: './admin-others-form.component.html',
  styleUrls: ['./admin-others-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminOthersFormComponent {
  wysiwygOptions = wysiwygOptions;
  id: string;

  @Input()
  othersItem: OthersItem;

  @Input()
  isLoading: boolean;

  @Output()
  submitted = new EventEmitter<OthersItem>();

  constructor(route: ActivatedRoute) {
    this.id = route.snapshot.params['id'];
  }

  onSubmit(f: NgForm) {
    this.othersItem = {
      ...this.othersItem,
      description: <string>addAttributeToIframe(this.othersItem.description, ' allowfullscreen '),
      shortDescription: <string>f.value.shortDescription || ''
    };
    this.submitted.emit(this.othersItem);
  }
}
