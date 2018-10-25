import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatButtonModule, MatSidenavModule, MatListModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from './navigation/navigation.component';
import { NavigationBarComponent } from './navigation/navigation-bar.component';
import { NavigationItemDirective } from './navigation/navigation-item.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [NavigationComponent, NavigationBarComponent, NavigationItemDirective],
  exports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    NavigationComponent,
    NavigationBarComponent,
    NavigationItemDirective
  ]
})
export class SharedModule {}
