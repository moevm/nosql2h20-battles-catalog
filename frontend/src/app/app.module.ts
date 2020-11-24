import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateBattleFormComponent } from './components/create-battle-form/create-battle-form.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MultipleInputComponent } from './components/create-battle-form/multiple-input/multiple-input.component';
import { ValueAccessor } from './shared/value-accessor';
import { WarCompareComponent } from './components/compare/war-compare/war-compare.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from './custom-echarts';
import { BattleCompareComponent } from './components/compare/battle-compare/battle-compare.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconService } from './maticon.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { WarsComponent } from './wars/wars.component';
import { BattlesComponent } from './battles/battles.component';
import { MatCardModule } from '@angular/material/card';
import { TableComponent } from './wars/table/table.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FilterHeaderModule } from './wars/table/filter-header/filter-header.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BaseUrlInterceptor } from './base-url.interceptor';
import { ActorsPipe } from './wars/table/actors.pipe';
import { ArmySizesPipe } from './wars/table/army-sizes.pipe';
import { ArmyLossesPipe } from './wars/table/army-losses.pipe';
import { DurationPipe } from './wars/table/duration.pipe';
import { TooltipActorsPipe } from './wars/table/tooltip/tooltip-actors.pipe';
import { TooltipArmySizesPipe } from './wars/table/tooltip/tooltip-army-sizes.pipe';
import { TooltipArmyLossesPipe } from './wars/table/tooltip/tooltip-army-losses.pipe';
import { BattleTableComponent } from './battles/table/battle-table.component';
import { BattleDurationPipe } from './battles/battle-duration.pipe';
import { BattleTooltipActorsPipe } from './battles/tooltip/battle-tooltip-actors.pipe';
import { BattleTooltipArmySizesPipe } from './battles/tooltip/battle-tooltip-army-sizes.pipe';
import { BattleTooltipArmyLossesPipe } from './battles/tooltip/battle-tooltip-army-losses.pipe';
import { ExportModalComponent } from './components/export-modal/export-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateBattleFormComponent,
    MultipleInputComponent,
    ValueAccessor,
    WarCompareComponent,
    BattleCompareComponent,
    WarsComponent,
    BattlesComponent,
    TableComponent,
    ActorsPipe,
    ArmySizesPipe,
    ArmyLossesPipe,
    DurationPipe,
    TooltipActorsPipe,
    TooltipArmySizesPipe,
    TooltipArmyLossesPipe,
    BattleTableComponent,
    BattleDurationPipe,
    BattleTooltipActorsPipe,
    BattleTooltipArmySizesPipe,
    BattleTooltipArmyLossesPipe,
    ExportModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgxEchartsModule.forRoot({echarts}),
    MatCheckboxModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    HttpClientModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    FilterHeaderModule,
    MatPaginatorModule,
    FormsModule
  ],
  providers: [
    ArmySizesPipe,
    ArmyLossesPipe,
    {provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true},
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: {color: 'primary'}
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: {color: 'primary'}
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        hideRequiredMarker: true,
        floatLabel: 'never'
      }
    },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: {disableOptionCentering: true}
    },
    {
      provide: APP_INITIALIZER,
      deps: [MatIconService],
      useFactory: (matIcon: MatIconService) => () => matIcon.init(),
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
