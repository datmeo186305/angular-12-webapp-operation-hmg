import { Injectable } from '@angular/core';
import {
  AdminAccountControllerService,
  MerchantControllerService,
} from 'open-api-modules/dashboard-api-docs';
import * as _ from 'lodash';
import { QUERY_CONDITION_TYPE } from '../../../../core/common/enum/operator';
import { MerchantStatus } from '../../../../../../open-api-modules/bnpl-api-docs';

@Injectable({
  providedIn: 'root',
})
export class MerchantListService {
  constructor(
    private merchantControllerService: MerchantControllerService,
    private adminAccountControllerService: AdminAccountControllerService
  ) {}

  public getData(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.merchantControllerService.getMerchants(
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
      requestBody['code' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] = params.keyword;
      requestBody['name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] = params.keyword;
      requestBody['email' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] = params.keyword;
      requestBody['mobile' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['userName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['productTypes' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }

  public getUserList() {
    let requestBody = {};
    return this.adminAccountControllerService.getAdminAccounts(
      100,
      0,
      requestBody,
      'createdAt',
      true
    );
  }

  public getMerchantParentList() {
    let requestBody = {};
    requestBody['childMerchantIds__ne'] = null;
    requestBody['childMerchantIds__ex'] = true;
    return this.merchantControllerService.getMerchants(
      100,
      0,
      requestBody,
      'createdAt',
      true
    );
  }

  public getAllMerchant() {
    let requestBody = {};
    requestBody['status__e'] = MerchantStatus.Active;
    return this.merchantControllerService.getMerchants(
      100,
      0,
      requestBody,
      'createdAt',
      true
    );
  }
}
