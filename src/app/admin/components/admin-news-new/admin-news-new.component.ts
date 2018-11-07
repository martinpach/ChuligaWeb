import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-news-new',
  templateUrl: './admin-news-new.component.html',
  styleUrls: ['./admin-news-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsNewComponent implements OnInit {
  wysiwygOptions = {
    editable: true,
    height: 'auto',
    minHeight: '150px',
    width: 'auto',
    minWidth: '150px',
    enableToolbar: true,
    showToolbar: true,
    toolbar: [
      ['bold', 'italic', 'underline', 'strikeThrough'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
      ['horizontalLine', 'orderedList', 'unorderedList'],
      ['link', 'video']
    ]
  };

  constructor() {}

  ngOnInit() {}
}
