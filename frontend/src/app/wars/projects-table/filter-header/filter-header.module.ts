import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterHeaderComponent } from './filter-header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [FilterHeaderComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatInputModule,
    MatCheckboxModule
  ],
  exports: [FilterHeaderComponent]
})
export class FilterHeaderModule { }
