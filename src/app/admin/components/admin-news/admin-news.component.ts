import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NewsItem } from '../../../shared/models';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsComponent implements OnInit {
  news: NewsItem[] = [
    {
      heading: 'Montessori tento týždeň na tému TELO',
      description: 'Lorem ipsum bla bla bla sad sad asd la bla bla sad sad asd la bla bla sad sad asd...',
      picture: 'https://picsum.photos/200/300/?random',
      date: new Date()
    },
    {
      heading: 'Montessori tento týždeň na tému TELO',
      description: 'Lorem ipsum bla bla bla sad sad asd la bla bla sad sad asd la bla bla sad sad asd...',
      picture: 'https://picsum.photos/200/300/?random',
      date: new Date()
    },
    {
      heading: 'Montessori tento týždeň na tému TELO',
      description: 'Lorem ipsum bla bla bla sad sad asd la bla bla sad sad asd la bla bla sad sad asd...',
      picture: 'https://picsum.photos/200/300/?random',
      date: new Date()
    }
  ];

  constructor() {}

  ngOnInit() {}
}
