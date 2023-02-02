import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ApiResponseString,
  PaydayLoanControllerService as PaydayLoanHmgControllerService,
} from '../../../../../../../open-api-modules/loanapp-hmg-api-docs';
import {
  ApiResponsePaydayLoan,
  PaydayLoanControllerService as PaydayLoanTngControllerService,
  UpdateLoanRequest,
} from '../../../../../../../open-api-modules/loanapp-tng-api-docs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  PaydayLoanHmg,
  PaydayLoanTng,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { RESPONSE_CODE } from '../../../../../core/common/enum/operator';
import {
  APPLICATION_TYPE,
  COMPANY_NAME,
} from '../../../../../core/common/enum/payday-loan';

@Component({
  selector: 'app-loan-note',
  templateUrl: './loan-note.component.html',
  styleUrls: ['./loan-note.component.scss'],
})
export class LoanNoteComponent implements OnInit {
  loanInfoForm: FormGroup;
  subManager = new Subscription();
  @Output() loanDetailDetectChangeStatus = new EventEmitter<any>();
  @Input() groupName: string;
  _loanId: string;
  @Input()
  get loanId(): string {
    return this._loanId;
  }

  set loanId(value: string) {
    this._loanId = value;
  }

  _loanDetail: PaydayLoanTng | PaydayLoanHmg;
  @Input()
  get loanDetail(): PaydayLoanTng | PaydayLoanHmg {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoanTng | PaydayLoanHmg) {
    this._loanDetail = value;
    this._initLoanInfoData();
  }

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private paydayLoanHmgControllerService: PaydayLoanHmgControllerService,
    private paydayLoanTngControllerService: PaydayLoanTngControllerService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.loanInfoForm = this.formBuilder.group({
      note: [''],
    });
  }

  ngOnInit(): void {}

  private _initLoanInfoData() {
    this.loanInfoForm.patchValue({
      note: this.loanDetail?.note,
    });
  }

  submitForm() {
    const updateLoanRequest: UpdateLoanRequest = {
      customerId: this.loanDetail?.customerId,
      updateInfo: {},
      applicationType: APPLICATION_TYPE.PDL_TNG,
    };
    updateLoanRequest.updateInfo['note'] =
      this.loanInfoForm.controls.note.value;

    switch (this.groupName) {
      case COMPANY_NAME.HMG:
        updateLoanRequest.applicationType = APPLICATION_TYPE.PDL_HMG;
        this.updateLoanHMGInfo(updateLoanRequest);
        break;
      case COMPANY_NAME.TNG:
        updateLoanRequest.applicationType = APPLICATION_TYPE.PDL_TNG;
        this.updateLoanInfo(updateLoanRequest);
        break;
      case COMPANY_NAME.VAC:
        updateLoanRequest.applicationType = this.loanDetail?.applicationType;
        this.updateLoanInfo(updateLoanRequest);
        break;
    }
  }

  private updateLoanInfo(updateLoanRequest: UpdateLoanRequest) {
    this.subManager.add(
      this.paydayLoanTngControllerService
        .updateInfo(this.loanId, updateLoanRequest)
        .subscribe((res: ApiResponsePaydayLoan) => {
          if (res.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(res.errorCode);
            return;
          }
          this.loanDetailDetectChangeStatus.emit();
        })
    );
  }

  private updateLoanHMGInfo(updateLoanRequest: UpdateLoanRequest) {
    this.subManager.add(
      this.paydayLoanHmgControllerService
        .updateInfo(this.loanId, updateLoanRequest)
        .subscribe((res: ApiResponseString) => {
          if (res.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(res.errorCode);
            return;
          }
          this.loanDetailDetectChangeStatus.emit();
        })
    );
  }
}
