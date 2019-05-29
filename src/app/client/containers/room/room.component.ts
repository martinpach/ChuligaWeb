import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { OthersService } from '../../../shared/services/others.service';
import { OthersItem } from '../../../shared/models';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent implements OnInit {
  id: string;
  serverData$: Observable<OthersItem>;
  roomHeadings: { [key: string]: string } = {
    houseOfCreativity: 'DOM KREATIVITY',
    theater: 'DIVADLO HALIGANDA',
    creativeSchools: 'KREATÍVNE ŠKOLY PRE DETI'
  };
  cardsImages: string[] = [];
  cardsLinks: any[] = [];
  thirdCardTitle: string;

  constructor(
    navigationService: NavigationService,
    route: ActivatedRoute,
    othersService: OthersService,
    private domSanitizer: DomSanitizer
  ) {
    navigationService.scrollBreakpoint.next(0);
    this.id = route.snapshot.params['id'];
    this.serverData$ = othersService.getOthersItem(this.id);
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    if (this.id === 'houseOfCreativity') {
      this.cardsImages = ['/assets/img/dk-galeria.jpg', '/assets/img/dk-program.jpg', '/assets/img/dk-sluzby.jpg'];
      this.cardsLinks = [
        '/gallery/p6e6gHHvKR3Eq0ScNL35',
        { link: '/events', queryParams: { filter: 'DK' } },
        { link: '/services', queryParams: {} }
      ];
      this.thirdCardTitle = 'SLUŽBY';
    } else if (this.id === 'theater') {
      this.cardsImages = ['/assets/img/divadlo-galeria.jpg', '/assets/img/divadlo-program.jpg', '/assets/img/divadlo-inscenacie.jpg'];
      this.cardsLinks = [
        '/gallery/Icz0zVgZB68ZH8eqYq8R',
        { link: '/events', queryParams: { filter: 'DH' } },
        { link: '/staging', queryParams: {} }
      ];
      this.thirdCardTitle = 'INSCENÁCIE';
    } else {
      this.cardsImages = ['/assets/img/ks-galeria.jpg', '/assets/img/ks-program.jpg', '/assets/img/ks-kurzy.jpg'];
      this.cardsLinks = [
        '/gallery/SSo6T3OM77ilLm03Zp94',
        { link: '/events', queryParams: { filter: 'KS' } },
        { link: '/courses', queryParams: { filter: 'KS' } }
      ];
      this.thirdCardTitle = 'KURZY';
    }
  }
}
