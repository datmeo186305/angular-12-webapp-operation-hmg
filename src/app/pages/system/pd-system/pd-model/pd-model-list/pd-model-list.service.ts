import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { QUERY_CONDITION_TYPE } from '../../../../../core/common/enum/operator';
import { CdeService } from '../../../../../../../open-api-modules/monexcore-api-docs';

@Injectable({
  providedIn: 'root',
})
export class PdModelListService {
  constructor(private cdeControllerService: CdeService) {}

  public getData(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.cdeControllerService.cdeControllerSearchPdModelPagination(
      params.sortDirection === 'desc',
      parseInt(params.pageIndex) + 1,
      params.limit,
      params.orderBy,
      JSON.stringify(requestBody)
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
      requestBody['fullName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['username' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }
}
