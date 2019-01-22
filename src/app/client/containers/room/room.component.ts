import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { OthersService } from '../../../shared/services/others.service';
import { OthersItem } from '../../../shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {
  id: string;
  serverData$: Observable<OthersItem>;
  roomHeadings = {
    houseOfCreativity: 'DOM KREATIVITY',
    montessori: 'MONTESSORI',
    familyCenter: 'RODINNÉ CENTRUM'
  };

  constructor(navigationService: NavigationService, route: ActivatedRoute, othersService: OthersService) {
    navigationService.scrollBreakpoint.next(0);
    this.id = route.snapshot.params['id'];
    this.serverData$ = othersService.getOthersItem(this.id);
    window.scrollTo(0, 0);
  }
}
