import { ApiResponseSearchAndPaginationResponseCompanyInfo } from './../../../../../open-api-modules/dashboard-api-docs/model/apiResponseSearchAndPaginationResponseCompanyInfo';
import { CompanyControllerService } from './../../../../../open-api-modules/dashboard-api-docs/api/companyController.service';
import { BankControllerService } from './../../../../../open-api-modules/dashboard-api-docs/api/bankController.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';

import * as fromActions from '../actions';
import { Store } from '@ngrx/store';
import * as fromStore from '../index';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { RESPONSE_CODE } from '../../common/enum/operator';
import { ApiResponseSearchAndPaginationResponseBank } from 'open-api-modules/dashboard-api-docs/model/apiResponseSearchAndPaginationResponseBank';

@Injectable()
export class CommonEffects {
  subManager = new Subscription();

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private bankControllerService: BankControllerService,
    private companyControllerService: CompanyControllerService
  ) {}

  getCommonInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GET_COMMON_INFO),
      map((action: fromActions.GetCommonInfo) => action.payload),
      switchMap(() => {
        const apis = [];
        apis.push(this.bankControllerService.getBanks(200, 0, {}));
        apis.push(this.companyControllerService.getCompanies(100, 0, {}));
        return forkJoin(apis).pipe(
          map(
            (
              response: Array<
                | ApiResponseSearchAndPaginationResponseBank
                | ApiResponseSearchAndPaginationResponseCompanyInfo
              >
            ) => {
              this.store$.dispatch(
                new fromActions.SetCommonInfo({
                  BankOptions: response[0]?.result.data,
                  CompanyOptions: response[1]?.result.data,
                })
              );
              return new fromActions.SetCommonInfo({
                BankOptions: response[0]?.result.data,
                CompanyOptions: response[1]?.result.data,
              });
            }
          )
        );
      })
    )
  );
}
