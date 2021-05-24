import { PipesModule } from './../../pipes/pipes.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExerciseNowMultiPage } from './exercise-now-multi';
import { MatDatepickerModule, MatNativeDateModule, MatInputModule, MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatGridListModule, MatIconModule, MatListModule, MatMenuModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { ComponentsModule } from '../../components/components.module';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ExportAsModule } from 'ngx-export-as';
import { ExcerciseAppForm } from '../../components/excercise-app-form/excercise-app-form.component';
import { PayUMoneyModule } from '../../pages/payu-money/payu-money.module'


@NgModule({
  declarations: [
    ExerciseNowMultiPage,
    ExcerciseAppForm
  ],
  imports: [
    PayUMoneyModule,
    IonicPageModule.forChild(ExerciseNowMultiPage),
    ExportAsModule,
    // PdfViewerModule,
    PipesModule,
    ComponentsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]})
export class ExerciseNowMultiPageModule {}
