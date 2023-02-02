import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/share/modules/material.modules';
import { SharedModule } from 'src/app/share/shared.module';
import { BlankComponent } from './blank/blank.component';
import { NotFoundComponent } from '../pages/errors/not-found/not-found.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './headers/header/header.component';
import { AppRoutingModule } from '../app-routing.module';
import { MobileMenuComponent } from './headers/navigation/mobile-menu/mobile-menu.component';
import { DesktopMenuComponent } from './headers/navigation/desktop-menu/desktop-menu.component';
import { ProfileToolbarComponent } from './headers/navigation/profile-toolbar/profile-toolbar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MainLayoutComponent,
    NotFoundComponent,
    BlankComponent,
    MobileMenuComponent,
    DesktopMenuComponent,
    ProfileToolbarComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    SharedModule,
    TranslateModule,
    AppRoutingModule,
  ],
})
export class LayoutModule {}
