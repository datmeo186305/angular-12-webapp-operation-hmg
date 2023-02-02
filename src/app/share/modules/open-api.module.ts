import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as dashboardApiDocs from '../../../../open-api-modules/dashboard-api-docs';
import * as loanappHmgApiDocs from '../../../../open-api-modules/loanapp-hmg-api-docs';
import * as loanappTngApiDocs from '../../../../open-api-modules/loanapp-tng-api-docs';
import * as comApiDocs from '../../../../open-api-modules/com-api-docs';
import * as customerApiDocs from '../../../../open-api-modules/customer-api-docs';
import * as identityApiDocs from '../../../../open-api-modules/identity-api-docs';
import * as coreApiDocs from '../../../../open-api-modules/core-api-docs';
import * as paymentApiDocs from '../../../../open-api-modules/payment-api-docs';
import * as contractApiDocs from '../../../../open-api-modules/contract-api-docs';
import * as bnplApiDocs from '../../../../open-api-modules/bnpl-api-docs';
import * as monexCoreApiDocs from '../../../../open-api-modules/monexcore-api-docs';
import { environment } from '../../../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // override base path in open-api-modules
    dashboardApiDocs.ApiModule.forRoot(() => {
      return new dashboardApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.DASHBOARD_API_PATH,
      });
    }),
    loanappHmgApiDocs.ApiModule.forRoot(() => {
      return new loanappHmgApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.LOANAPP_HMG_API_PATH,
      });
    }),
    loanappTngApiDocs.ApiModule.forRoot(() => {
      return new loanappTngApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.LOANAPP_API_PATH,
      });
    }),
    comApiDocs.ApiModule.forRoot(() => {
      return new comApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.COM_API_PATH,
      });
    }),
    customerApiDocs.ApiModule.forRoot(() => {
      return new customerApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.CUSTOMER_API_PATH,
      });
    }),
    identityApiDocs.ApiModule.forRoot(() => {
      return new customerApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.IDENTITY_API_PATH,
      });
    }),
    coreApiDocs.ApiModule.forRoot(() => {
      return new loanappTngApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.CORE_API_PATH,
      });
    }),
    paymentApiDocs.ApiModule.forRoot(() => {
      return new paymentApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.PAYMENT_API_PATH,
      });
    }),
    contractApiDocs.ApiModule.forRoot(() => {
      return new contractApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.CONTRACT_API_PATH,
      });
    }),
    bnplApiDocs.ApiModule.forRoot(() => {
      return new bnplApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.BNPL_API_PATH,
      });
    }),
    monexCoreApiDocs.ApiModule.forRoot(() => {
      return new monexCoreApiDocs.Configuration({
        basePath: environment.API_BASE_URL + environment.MONEXCORE_API_PATH,
      });
    }),
  ],
})
export class OpenApiModule {}
