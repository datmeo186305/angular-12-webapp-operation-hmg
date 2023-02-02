import { Injectable } from '@angular/core';
import {
  ApplicationDocumentsService as MonexCoreApplicationDocumentControllerService,
  CreateDocumentDto,
  CreateDocumentTypeDto,
  UpdateDocumentDto,
  UpdateDocumentTypeDto,
} from '../../../../../../../open-api-modules/monexcore-api-docs';
import { QUERY_CONDITION_TYPE } from '../../../../../core/common/enum/operator';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ConfigDocumentListService {
  constructor(
    private monexCoreApplicationDocumentControllerService: MonexCoreApplicationDocumentControllerService
  ) {}

  public getDataApplicationDocuments(params) {
    let requestBody = this._buildRequestBodyGetListApplicationDocument(params);

    return this.monexCoreApplicationDocumentControllerService.documentControllerSearchRequiredDocumentPagination(
      params.sortDirection === 'desc',
      parseInt(params.pageIndex) + 1,
      params.limit,
      params.orderBy,
      JSON.stringify(requestBody)
    );
  }

  private _buildRequestBodyGetListApplicationDocument(params) {
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
      requestBody['name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] = params.keyword;
      requestBody['description' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }

  public getDataApplicationDocumentTypes(params) {
    let requestBody =
      this._buildRequestBodyGetListApplicationDocumentType(params);

    return this.monexCoreApplicationDocumentControllerService.documentControllerSearchPaginationRequiredDocumentType(
      params.sortDirection === 'desc',
      parseInt(params.pageIndex) + 1,
      params.limit,
      params.orderBy,
      JSON.stringify(requestBody)
    );
  }

  private _buildRequestBodyGetListApplicationDocumentType(params) {
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
      requestBody['name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] = params.keyword;
      requestBody['description' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }

  public deleteApplicationDocument(id: string) {
    return this.monexCoreApplicationDocumentControllerService.documentControllerDeleteApplicationDocument(
      id
    );
  }

  public createApplicationDocument(createDocumentDto: CreateDocumentDto) {
    return this.monexCoreApplicationDocumentControllerService.documentControllerCreateApplicationDocument(
      createDocumentDto
    );
  }

  public updateApplicationDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto
  ) {
    return this.monexCoreApplicationDocumentControllerService.documentControllerUpdateApplicationDocument(
      id,
      updateDocumentDto
    );
  }

  public createApplicationDocumentType(
    createDocumentTypeDto: CreateDocumentTypeDto
  ) {
    return this.monexCoreApplicationDocumentControllerService.documentControllerCreateApplicationDocumentType(
      createDocumentTypeDto
    );
  }

  public updateApplicationDocumentType(
    id: string,
    updateApplicationDocumentTypeRequest: UpdateDocumentTypeDto
  ) {
    return this.monexCoreApplicationDocumentControllerService.documentControllerUpdateApplicationDocumentType(
      id,
      updateApplicationDocumentTypeRequest
    );
  }

  public deleteApplicationDocumentType(id: string) {
    return this.monexCoreApplicationDocumentControllerService.documentControllerDeleteApplicationDocumentType(
      id
    );
  }
}
