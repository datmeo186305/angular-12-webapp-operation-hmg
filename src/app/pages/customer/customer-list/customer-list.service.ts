import {
  ACCOUNT_CLASSIFICATION,
  CUSTOMER_STATUS,
} from '../../../core/common/enum/payday-loan';
import { Injectable } from '@angular/core';
import { CustomerControllerService } from 'open-api-modules/dashboard-api-docs';
import * as _ from 'lodash';
import {
  QUERY_CONDITION_TYPE,
  QUERY_OPERATOR_TYPE,
} from '../../../core/common/enum/operator';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerListService {
  constructor(private customerControllerService: CustomerControllerService) {}

  public getData(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.customerControllerService.getCustomers(
      params.limit,
      params.pageIndex,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }

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

    if (params.startTime || params.endTime) {
      requestBody['createdAt' + QUERY_CONDITION_TYPE.BETWEEN] = {
        start: params.startTime,
        end: params.endTime,
      };
    }

    if (params.keyword) {
      requestBody['firstName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['mobileNumber' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['emailAddress' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['organizationName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    switch (params.accountClassification) {
      case ACCOUNT_CLASSIFICATION.ALL:
        delete requestBody['mobileNumber'];
        break;

      case ACCOUNT_CLASSIFICATION.TEST:
        requestBody[
          'mobileNumber' +
            QUERY_OPERATOR_TYPE.OR +
            QUERY_CONDITION_TYPE.START_WITH
        ] = environment.PREFIX_MOBILE_NUMBER_TEST;
        requestBody[
          'identityNumberOne' +
            QUERY_OPERATOR_TYPE.OR +
            QUERY_CONDITION_TYPE.EQUAL
        ] = environment.IDENTITY_NUMBER_ONE_TEST;
        requestBody[
          'organizationName' + QUERY_OPERATOR_TYPE.OR + QUERY_CONDITION_TYPE.IN
        ] = environment.ORGANIZATION_NAME_TEST;
        break;
      case ACCOUNT_CLASSIFICATION.REAL:
      default:
        requestBody['mobileNumber' + QUERY_CONDITION_TYPE.NOT_START_WITH] =
          environment.PREFIX_MOBILE_NUMBER_TEST;
        requestBody['identityNumberOne' + QUERY_CONDITION_TYPE.NOT_EQUAL] =
          environment.IDENTITY_NUMBER_ONE_TEST;
        requestBody['organizationName' + QUERY_CONDITION_TYPE.NOT_IN] =
          environment.ORGANIZATION_NAME_TEST;
        break;
    }

    switch (params.customerStatus) {
      case CUSTOMER_STATUS.NOT_VERIFIED:
        requestBody['isVerified' + QUERY_CONDITION_TYPE.NOT_EQUAL] = true;
        requestBody['kalapaData.createdAt' + QUERY_CONDITION_TYPE.NOT_EXIST] =
          true;
        break;
      case CUSTOMER_STATUS.ALREADY_EKYC:
        requestBody['isVerified' + QUERY_CONDITION_TYPE.NOT_EQUAL] = true;
        requestBody['kalapaData.createdAt' + QUERY_CONDITION_TYPE.EXIST] = true;
        break;
      case CUSTOMER_STATUS.ALREADY_VERIFIED:
        requestBody['isVerified' + QUERY_CONDITION_TYPE.EQUAL] = true;
        break;
      case CUSTOMER_STATUS.ALL:
      default:
        delete requestBody['isVerified'];
        delete requestBody['kalapaData.createdAt'];
        break;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }
}
