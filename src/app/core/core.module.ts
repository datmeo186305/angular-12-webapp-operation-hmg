import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreStoreModule } from './store';

import { throwIfAlreadyLoaded } from './common/module-import-guard';

// Import your library
import { NgxPermissionsModule } from 'ngx-permissions';

// interceptors
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../share/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { _providers } from './providers';
import { MomentModule } from 'ngx-moment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

//Toastr
import { ToastrModule } from 'ngx-toastr';
import { GlobalConfig } from 'ngx-toastr/toastr/toastr-config';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    '.json?cacheBuster=' + new Date().toISOString().replace(/\.|:|-/g, '')
  );
}

const customNotifierOptions: Partial<GlobalConfig> = {
  positionClass: 'toast-bottom-right',
  maxOpened: 3, // max toasts opened
  autoDismiss: true, // dismiss current toast when max is reached
};

export function tokenGetter() {
  let coreState = JSON.parse(localStorage.getItem('core'));
  return coreState?.login?.authorization?.token;
}

@NgModule({
  imports: [
    CommonModule,
    NgxPermissionsModule.forRoot(),
    CoreStoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(customNotifierOptions),
    SharedModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['operator-staging.epay.vn', 'operator.monex.vn'],
      },
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MomentModule,
  ],
  providers: [_providers],
  declarations: [],
  exports: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
