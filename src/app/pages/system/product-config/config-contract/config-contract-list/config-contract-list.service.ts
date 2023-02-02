import { Injectable } from '@angular/core';
import { QUERY_CONDITION_TYPE } from '../../../../../core/common/enum/operator';
import * as _ from 'lodash';
import {
  ContractTemplatesService,
  CreateContractDto,
  LoanProductsService,
  LoanStatusService,
  UpdateContractDto,
  V1ContractPropertyService,
} from '../../../../../../../open-api-modules/monexcore-api-docs';
import {
  ContractControllerService,
  PreviewContractRequest,
} from '../../../../../../../open-api-modules/com-api-docs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigContractListService {
  constructor(
    private monexCoreContractTemplateControllerService: ContractTemplatesService,
    private contractPropertyService: V1ContractPropertyService,
    private loanProductsService: LoanProductsService,
    private contractControllerService: ContractControllerService,
    private loanStatusService: LoanStatusService
  ) {}

  public getData(params) {
    let requestBody = this._buildRequestBodyGetList(params);
    return this.monexCoreContractTemplateControllerService.contractTemplateControllerSearchPagination(
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
      requestBody['createAt' + QUERY_CONDITION_TYPE.BETWEEN] = {
        start: params.startTime,
        end: params.endTime,
      };
    }

    if (params.keyword) {
      requestBody['name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] = params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }

  public createContractTemplate(createContractDto: CreateContractDto) {
    return this.monexCoreContractTemplateControllerService.contractTemplateControllerCreateContract(
      createContractDto
    );
  }

  public deleteContractTemplate(id: any) {
    return this.monexCoreContractTemplateControllerService.contractTemplateControllerDeleteContract(
      id
    );
  }

  public updateContractTemplate(id: any, updateContractDto: UpdateContractDto) {
    return this.monexCoreContractTemplateControllerService.contractTemplateControllerUpdateContract(
      id,
      updateContractDto
    );
  }

  public getDataPropertiesContract(
    descending: boolean,
    page: number,
    limit: number,
    orderBy: string
  ) {
    return this.contractPropertyService.contractPropertyControllerSearchPagination(
      descending,
      page,
      limit,
      orderBy,
      JSON.stringify({})
    );
  }

  public getLoanProducts() {
    return this.loanProductsService.loanProductControllerGetListLoanProduct();
  }

  public getLoanStatuses(groupId: any) {
    return this.loanStatusService.loanStatusControllerGetStatusGroupById(
      groupId
    );
  }

  public previewContract(previewContractRequest: PreviewContractRequest) {
    return this.contractControllerService
      .previewContract(previewContractRequest)
      .pipe(
        map((results) => {
          return this.convertBlobType(results, 'application/pdf');
        }),

        catchError((err) => {
          throw err;
        })
      );
  }

  public convertBlobType(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    return window.URL.createObjectURL(blob);
  }
}
