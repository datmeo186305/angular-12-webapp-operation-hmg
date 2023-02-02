import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutes } from './auth-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/share/modules/material.modules';
import { SignInComponent } from './sign-in/sign-in.component';
import { SharedModule } from 'src/app/share/shared.module';

@NgModule({
  declarations: [
    SignInComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    TranslateModule,
    SharedModule,
    RouterModule.forChild(AuthRoutes),
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class AuthModule {}
