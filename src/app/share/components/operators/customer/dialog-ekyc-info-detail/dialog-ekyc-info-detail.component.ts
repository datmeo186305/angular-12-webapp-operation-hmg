import { DATA_CELL_TYPE, DATA_STATUS_TYPE } from './../../../../../core/common/enum/operator';
import { KalapaResponse } from './../../../../../../../open-api-modules/customer-api-docs/model/kalapaResponse';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Bank,
  CompanyInfo,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-ekyc-info-detail',
  templateUrl: './dialog-ekyc-info-detail.component.html',
  styleUrls: ['./dialog-ekyc-info-detail.component.scss'],
})
export class DialogEkycInfoDetailComponent implements OnInit {
  // ekycData: KalapaResponse;

  leftIndividualInfos: any[] = [];
  rightIndividualInfos: any[] = [];

  _ekycData: KalapaResponse;

  @Input()
  get ekycData(): KalapaResponse {
    return this._ekycData;
  }

  set ekycData(value: KalapaResponse) {
    this._ekycData = value;
    this.leftIndividualInfos = this._initLeftIndividualInfos();
    this.rightIndividualInfos = this._initRightIndividualInfos();
  }

  constructor(
    private dialogRef: MatDialogRef<DialogEkycInfoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder
  ) {
    if (data) {
      this.ekycData = data.data;
    }
  }

  ngOnInit(): void {}

  private _initLeftIndividualInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'customer.ekyc_detail.matched'
        ),
        value: this.ekycData?.selfieCheck?.matched ? false : true,
        type: DATA_CELL_TYPE.CHECK,
        format: DATA_STATUS_TYPE.PL_EKYC_STATUS,
        showed: true,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.ekyc_detail.matching_score'
        ),
        value: this.ekycData?.selfieCheck?.matchingScore,
        type: DATA_CELL_TYPE.NUMBER,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.ekyc_detail.faces_matched'
        ),
        value: this.ekycData?.fraudCheck?.facesMatched,
        type: DATA_CELL_TYPE.NUMBER,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.ekyc_detail.floating_mark'
        ),
        value: this.ekycData?.fraudCheck?.floatingMark,
        type: DATA_CELL_TYPE.CHECK,
        format: DATA_STATUS_TYPE.PL_EKYC_STATUS,
        showed: true,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.ekyc_detail.screen_photo'
        ),
        value: this.ekycData?.fraudCheck?.screenPhoto,
        type: DATA_CELL_TYPE.CHECK,
        format: DATA_STATUS_TYPE.PL_EKYC_STATUS,
        showed: true,
      },
    ];
  }

  private _initRightIndividualInfos() {
    return [
      {
        title: this.multiLanguageService.instant('customer.ekyc_detail.blacklist'),
        value: this.ekycData?.fraudCheck?.blacklist,
        type: DATA_CELL_TYPE.CHECK,
        format: DATA_STATUS_TYPE.PL_EKYC_STATUS,
        showed: true,
      },
      {
        title: this.multiLanguageService.instant('customer.ekyc_detail.abnormal_text'),
        value: this.ekycData?.fraudCheck?.abnormalText,
        type: DATA_CELL_TYPE.CHECK,
        format: DATA_STATUS_TYPE.PL_EKYC_STATUS,
        showed: true,
      },
      {
        title: this.multiLanguageService.instant('customer.ekyc_detail.abnormal_face'),
        value: this.ekycData?.fraudCheck?.abnormalFace,
        type: DATA_CELL_TYPE.CHECK,
        format: DATA_STATUS_TYPE.PL_EKYC_STATUS,
        showed: true,
      },
      {
        title: this.multiLanguageService.instant('customer.ekyc_detail.corner_cut'),
        value: this.ekycData?.fraudCheck?.cornerCut,
        type: DATA_CELL_TYPE.CHECK,
        format: DATA_STATUS_TYPE.PL_EKYC_STATUS,
        showed: true,
      },
    ];
  }
}
