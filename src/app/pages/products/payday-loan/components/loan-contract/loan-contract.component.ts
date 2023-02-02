import { Contract } from './../../../../../../../open-api-modules/loanapp-tng-api-docs/model/contract';
import { ApiResponseContract } from './../../../../../../../open-api-modules/loanapp-tng-api-docs/model/apiResponseContract';
import {
  CustomerInfo,
  PaydayLoanHmg,
  PaydayLoanTng,
} from 'open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { DomSanitizer } from '@angular/platform-browser';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  RESPONSE_CODE,
} from 'src/app/core/common/enum/operator';
import { LoanListService } from '../../loan-list/loan-list.service';
import { Subscription } from 'rxjs';
import {
  COMPANY_NAME,
  PAYDAY_LOAN_STATUS,
  SIGN_STATUS,
  TERM_TYPE,
} from '../../../../../core/common/enum/payday-loan';

@Component({
  selector: 'app-loan-contract',
  templateUrl: './loan-contract.component.html',
  styleUrls: ['./loan-contract.component.scss'],
})
export class LoanContractComponent implements OnInit, OnDestroy {
  loanContractView: any;
  loanContractData: Contract;
  loanContractFile: any;
  enableSign: boolean = false;
  displayStatus;
  downloadable: boolean = false;

  subManager = new Subscription();
  @Output() triggerUpdateLoanAfterSign = new EventEmitter();

  constructor(
    private notifier: ToastrService,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private multiLanguageService: MultiLanguageService,
    private loanListService: LoanListService
  ) {}

  _loanId: string;

  @Input()
  get loanId(): string {
    return this._loanId;
  }

  set loanId(value: string) {
    this._loanId = value;
  }

  _loanDetail: PaydayLoanTng;

  @Input()
  get loanDetail(): PaydayLoanTng {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoanTng ) {
    this._loanDetail = value;
    this.getDisplayStatus();
    this._getLoanContractData();
  }

  _customerInfo: CustomerInfo;
  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._customerInfo = value;
  }

  ngOnInit(): void {
    // this._getLoanContractData();
  }

  getDisplayStatus() {
    let newDataStatusType: DATA_STATUS_TYPE;
    switch (this.loanDetail?.companyInfo?.groupName) {
      case COMPANY_NAME.HMG:
        newDataStatusType = DATA_STATUS_TYPE.PL_HMG_STATUS;
        break;
      case COMPANY_NAME.VAC:
        newDataStatusType = DATA_STATUS_TYPE.PL_VAC_STATUS;
        break;
      case COMPANY_NAME.TNG:
      default:
        newDataStatusType = DATA_STATUS_TYPE.PL_TNG_STATUS;
        break;
    }

    this.displayStatus = {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.loan_status'
      ),
      value: this.loanDetail?.status,
      type: DATA_CELL_TYPE.STATUS,
      format: newDataStatusType,
    };
    return this.displayStatus;
  }

  checkSignable() {
    if (
      this.loanDetail?.companyInfo?.groupName === COMPANY_NAME.HMG &&
      this.loanDetail?.status === PAYDAY_LOAN_STATUS.CONTRACT_AWAITING
    ) {
      return (this.enableSign = true);
    }

    if (
      this.loanDetail?.companyInfo?.groupName === COMPANY_NAME.TNG &&
      this.loanDetail?.status === PAYDAY_LOAN_STATUS.FUNDED &&
      this.loanContractData?.status === SIGN_STATUS.AWAITING_EPAY_SIGNATURE
    ) {
      return (this.enableSign = true);
    }

    if (
      this.loanDetail?.companyInfo?.groupName === COMPANY_NAME.VAC &&
      this.loanDetail?.termType === TERM_TYPE.ONE_MONTH &&
      this.loanDetail?.status === PAYDAY_LOAN_STATUS.FUNDED &&
      this.loanContractData?.status === SIGN_STATUS.AWAITING_EPAY_SIGNATURE
    ) {
      return (this.enableSign = true);
    }

    if (
      this.loanDetail?.companyInfo?.groupName === COMPANY_NAME.VAC &&
      this.loanDetail?.termType === TERM_TYPE.THREE_MONTH &&
      this.loanDetail?.status === PAYDAY_LOAN_STATUS.CONTRACT_AWAITING
    ) {
      return (this.enableSign = true);
    }

    if (
      this.loanDetail?.status === PAYDAY_LOAN_STATUS.FUNDED &&
      this.loanContractData?.status === SIGN_STATUS.AWAITING_EPAY_SIGNATURE
    ) {
      return (this.enableSign = true);
    }

    return (this.enableSign = false);
  }

  onClickSign() {
    const customerId = this.loanDetail?.customerId;
    const idRequest = this.loanContractData.idRequest;
    const idDocument = this.loanContractData.idDocument;

    this.subManager.add(
      this.loanListService
        .signContract(customerId, idRequest, idDocument)
        .subscribe((result) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(
              this.multiLanguageService.instant(
                'loan_app.loan_contract.sign_fail'
              )
            );
            return;
          }

          this.triggerUpdateLoanAfterSign.emit();
          setTimeout(() => {
            this.notifier.success(
              this.multiLanguageService.instant(
                'loan_app.loan_info.sign_success'
              )
            );
          }, 3000);
        })
    );
  }

  downloadFileContract(documentPath, customerId) {
    this.subManager.add(
      this.loanListService
        .downloadSingleFileContract(documentPath, customerId)
        .subscribe((data) => {
          this.loanContractFile = data;
          this.pdfView(this.loanContractFile);
        })
    );
  }

  onClickDownload() {
    this.loanListService.downloadBlobFile(this.loanContractFile);
    this.notifier.info(
      this.multiLanguageService.instant('loan_app.loan_contract.downloading')
    );
  }

  pdfView(pdfurl: string) {
    pdfurl += '#toolbar=1&navpanes=0&scrollbar=0&zoom=90';
    this.loanContractView = this.domSanitizer.bypassSecurityTrustHtml(
      "<iframe  src='" +
        pdfurl +
        "' type='application/pdf' style='width:100%; height: 70vh; background-color:white;'>" +
        'Object ' +
        pdfurl +
        ' failed' +
        '</iframe>'
    );
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  private _getLoanContractData() {
    this.subManager.add(
      this.loanListService
        .getContractData(
          this.loanDetail?.id,
          this.loanDetail?.companyInfo?.groupName
        )
        .subscribe((response: ApiResponseContract) => {
          if (response.result === null) {
            return (this.loanContractData = null);
          }
          this.downloadable = true;
          this.loanContractData = response.result;
          this.downloadFileContract(
            this.loanContractData.path,
            this.loanDetail?.customerId
          );
          this.checkSignable();
        })
    );
  }
}
