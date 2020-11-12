import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicHeaderComponent } from './basic-header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
    declarations: [BasicHeaderComponent, UserMenuComponent],
    exports: [
        BasicHeaderComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule
    ]
})
export class BasicHeaderModule {
}
