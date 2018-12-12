import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNavComponent {
  isMenuVisible = false;
  navItems: { label: string; path: string }[] = [
    {
      label: 'Aktuality',
      path: '/admin/news'
    },
    {
      label: 'Program',
      path: '/admin/events'
    },
    {
      label: 'Služby',
      path: '/admin/services'
    },
    {
      label: 'Galéria',
      path: '/admin/gallery'
    },
    {
      label: 'Kontakt',
      path: '/admin/contacts'
    },
    {
      label: 'Iné',
      path: '/admin/others'
    }
  ];

  @Output()
  logout = new EventEmitter();
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
}
