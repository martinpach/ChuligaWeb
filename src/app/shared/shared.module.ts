import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatButtonModule } from '@angular/material';

@NgModule({
  exports: [CommonModule, FormsModule, MatInputModule, MatButtonModule]
})
export class SharedModule {}
