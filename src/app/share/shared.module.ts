import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material.modules';
import { TranslateModule } from '@ngx-translate/core';
import * as fromComponents from './components';
import * as fromValidators from './validators';
import * as fromPipes from './pipes';
import * as fromDirectives from './directives';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxViewerModule } from 'ngx-viewer';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [
    ...fromComponents.components,
    ...fromValidators.validators,
    ...fromDirectives.directives,
    ...fromPipes.pipes,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    FormsModule,
    NgxPermissionsModule,
    NgxViewerModule,
    NgxMatSelectSearchModule,
    InfiniteScrollModule,
    CKEditorModule,
  ],
  exports: [
    MaterialModule,
    NgxPermissionsModule,
    NgxViewerModule,
    NgxMatSelectSearchModule,
    InfiniteScrollModule,
    ...fromComponents.components,
    ...fromValidators.validators,
    ...fromDirectives.directives,
    ...fromPipes.pipes,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
})
export class SharedModule {}
