import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNavComponent {
  isMenuVisible = false;
  @Output()
  logout = new EventEmitter();
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
}
