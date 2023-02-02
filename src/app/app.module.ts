import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { OpenApiModule } from './share/modules/open-api.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './share/shared.module';
import { LayoutModule } from './layout/layout.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    OpenApiModule,
    SharedModule,
    LayoutModule,
    ChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
