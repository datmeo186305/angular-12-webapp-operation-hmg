import { Injectable } from '@angular/core';
import {
  ACCOUNT_CLASSIFICATION,
  APPLICATION_TYPE,
} from '../../../../core/common/enum/payday-loan';
import {
  QUERY_CONDITION_TYPE,
  QUERY_OPERATOR_TYPE,
} from '../../../../core/common/enum/operator';
import { environment } from '../../../../../environments/environment';
import * as _ from 'lodash';
import {
  BNPL_STATUS,
  PAYMENT_METHOD,
  REPAYMENT_STATUS,
} from '../../../../core/common/enum/bnpl';
import { BnplApplicationControllerService } from '../../../../../../open-api-modules/dashboard-api-docs';
import {
  AdminControllerService,
  BnplControllerService,
  ChangeLoanStatusRequest,
  UpdateLoanRequestDto,
} from '../../../../../../open-api-modules/bnpl-api-docs';
import { ContractControllerService } from '../../../../../../open-api-modules/com-api-docs';
import { catchError, map } from 'rxjs/operators';
import { RepaymentControllerService } from '../../../../../../open-api-modules/payment-api-docs';

@Injectable({
  providedIn: 'root',
})
export class BnplListService {
  constructor(
    private dashboardBnplApplicationControllerService: BnplApplicationControllerService,
    private bnplControllerService: BnplControllerService,
    private adminBnplControllerService: AdminControllerService,
    private contractControllerService: ContractControllerService,
    private repaymentControllerService: RepaymentControllerService
  ) {}

  private _buildRequestBodyGetList(params) {
    let requestBody = {};

    if (params.filterConditions) {
      for (const [paramName, paramValue] of Object.entries(
        params.filterConditions
      )) {
        if (!_.isEmpty(params[paramName])) {
          requestBody[paramName + paramValue] = params[paramName] || '';
        }
      }
    }

    switch (params.status) {
      case REPAYMENT_STATUS.BADDEBT:
        requestBody['isBadDebt' + QUERY_CONDITION_TYPE.EQUAL] = true;
        requestBody['status'] = BNPL_STATUS.DISBURSE;
        delete requestBody['status__in'];
        break;
      case REPAYMENT_STATUS.PAYMENT_TERM_1:
        let now = new Date();
        requestBody[
          'periodTime2.convertedDueDate' + QUERY_CONDITION_TYPE.GREATER_THAN
        ] = now;
        requestBody['periodTime2.complete' + QUERY_CONDITION_TYPE.NOT_EQUAL] =
          true;
        requestBody['periodTime3.complete' + QUERY_CONDITION_TYPE.NOT_EQUAL] =
          true;
        requestBody['periodTime4.complete' + QUERY_CONDITION_TYPE.NOT_EQUAL] =
          true;
        requestBody['status'] = BNPL_STATUS.DISBURSE;
        delete requestBody['status__in'];
        break;
      case REPAYMENT_STATUS.PAYMENT_TERM_2:
        requestBody['periodTime2.complete__e'] = true;
        requestBody['periodTime3.complete' + QUERY_CONDITION_TYPE.NOT_EQUAL] =
          true;
        requestBody['periodTime4.complete' + QUERY_CONDITION_TYPE.NOT_EQUAL] =
          true;
        requestBody['status'] = BNPL_STATUS.DISBURSE;
        delete requestBody['status__in'];
        break;
      case REPAYMENT_STATUS.PAYMENT_TERM_3:
        requestBody['periodTime3.complete__e'] = true;
        requestBody['periodTime4.complete' + QUERY_CONDITION_TYPE.NOT_EQUAL] =
          true;
        requestBody['status'] = BNPL_STATUS.DISBURSE;
        delete requestBody['status__in'];
        break;
      case REPAYMENT_STATUS.OVERDUE:
        requestBody['status'] = REPAYMENT_STATUS.OVERDUE;
        delete requestBody['status__in'];
        break;
      default:
        break;
    }

    if (params.startTime || params.endTime) {
      requestBody['createdAt' + QUERY_CONDITION_TYPE.BETWEEN] = {
        start: params.startTime,
        end: params.endTime,
      };
    }

    if (params.keyword) {
      requestBody[
        'customerInfo.firstName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
      ] = params.keyword;
      requestBody['loanCode' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody[
        'customerInfo.mobileNumber' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
      ] = params.keyword;
      requestBody[
        'customerInfo.emailAddress' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
      ] = params.keyword;
      requestBody['merchant.name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['merchant.code' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    switch (params.accountClassification) {
      case ACCOUNT_CLASSIFICATION.ALL:
        delete requestBody['customerInfo.mobileNumber'];
        break;

      case ACCOUNT_CLASSIFICATION.TEST:
        requestBody[
          'customerInfo.mobileNumber' +
            QUERY_OPERATOR_TYPE.OR +
            QUERY_CONDITION_TYPE.START_WITH
        ] = environment.PREFIX_MOBILE_NUMBER_TEST;
        requestBody[
          'customerInfo.identityNumberOne' +
            QUERY_OPERATOR_TYPE.OR +
            QUERY_CONDITION_TYPE.EQUAL
        ] = environment.IDENTITY_NUMBER_ONE_TEST;
        break;
      case ACCOUNT_CLASSIFICATION.REAL:
      default:
        requestBody[
          'customerInfo.mobileNumber' + QUERY_CONDITION_TYPE.NOT_START_WITH
        ] = environment.PREFIX_MOBILE_NUMBER_TEST;
        requestBody[
          'customerInfo.identityNumberOne' + QUERY_CONDITION_TYPE.NOT_EQUAL
        ] = environment.IDENTITY_NUMBER_ONE_TEST;
        break;
    }
    console.log('requestBody--------------------------------', requestBody);
    return requestBody;
  }

  public getData(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.dashboardBnplApplicationControllerService.findBnplApplications(
      params.pageSize,
      params.pageNumber,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }

  public getBnplById(id) {
    return this.dashboardBnplApplicationControllerService.getBnplApplicationById(
      id
    );
  }

  public convertBlobType(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    return url;
  }

  public updateBnplApplication(
    id,
    updateLoanRequestDto?: UpdateLoanRequestDto
  ) {
    return this.bnplControllerService.v1ApplicationLoanIdPut(
      id,
      updateLoanRequestDto
    );
  }

  public changeStatusBnplApplication(
    id: string,
    changeLoanStatusRequest?: ChangeLoanStatusRequest
  ) {
    return this.adminBnplControllerService.v1AdminApplicationIdChangeStatusPost(
      id,
      changeLoanStatusRequest
    );
  }

  public repaymentBnplApplication(
    id: string,
    transactionAmount: any,
    observe?: any,
    reportProgress?: boolean
  ) {
    return this.repaymentControllerService.updateRepaymentTransaction(
      {
        amount: transactionAmount,
        applicationId: id,
        applicationType: APPLICATION_TYPE.BNPL,
        provider: PAYMENT_METHOD.IN_CASH,
      },
      observe,
      reportProgress
    );
  }

  public downloadBlobFile(src, loanId) {
    const a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', src);
    a.setAttribute('download', 'Hopdongmuangaytrasau-' + loanId + '.pdf');
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  public downloadBnplContract(id: string) {
    return this.contractControllerService
      .getContractFile(id, null, null, {
        httpHeaderAccept: 'application/octet-stream',
      })
      .pipe(
        map((results) => {
          return this.convertBlobType(results, 'application/pdf');
        }),

        catchError((err) => {
          throw err;
        })
      );
  }
}
