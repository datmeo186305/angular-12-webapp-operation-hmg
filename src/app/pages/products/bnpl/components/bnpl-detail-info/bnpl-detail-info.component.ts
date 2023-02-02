import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  BnplApplication,
  CustomerInfo,
  PaydayLoanTng,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import {
  BNPL_PAYMENT_TYPE,
  MERCHANT_SELL_TYPE_TEXT,
} from '../../../../../core/common/enum/bnpl';

@Component({
  selector: 'app-bnpl-detail-info',
  templateUrl: './bnpl-detail-info.component.html',
  styleUrls: ['./bnpl-detail-info.component.scss'],
})
export class BnplDetailInfoComponent implements OnInit {
  @Input() userInfo: CustomerInfo;

  _loanDetail: BnplApplication;
  @Input()
  get loanDetail(): BnplApplication | any {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoanTng) {
    this._loanDetail = value;
    this.leftColumns = this._initLeftColumn();
    this.rightColumns = this._initRightColumn();
  }

  @Output() triggerChangeStatusBnplApplication = new EventEmitter<any>();
  @Output() triggerRepaymentBnplApplication = new EventEmitter<any>();

  leftColumns: any[] = [];
  rightColumns: any[] = [];

  constructor(private multiLanguageService: MultiLanguageService) {}

  ngOnInit(): void {}

  private _initLeftColumn() {
    return [
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.loan_code'),
        value: this.loanDetail?.loanCode,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.created_at'),
        value: this.loanDetail?.createdAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'HH:mm:ss dd/MM/yyyy',
      },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.merchant'),
        value: this.loanDetail?.merchant?.name,
        type: DATA_CELL_TYPE.HYPERLINK,
        format: `/system/merchant/list?id__e=${this.loanDetail?.merchant?.id}&accountClassification=ALL`,
      },
      {
        title: this.multiLanguageService.instant(
          'bnpl.loan_info.customer_name'
        ),
        value: this.loanDetail?.customerInfo?.firstName,
        type: DATA_CELL_TYPE.HYPERLINK,
        format: `/customer/list?id__e=${this.loanDetail?.customerId}&accountClassification=ALL`,
      },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.phone_number'),
        value: this.loanDetail?.customerInfo?.mobileNumber,
        type: DATA_CELL_TYPE.HYPERLINK,
        format: `/customer/list?id__e=${this.loanDetail?.customerId}&accountClassification=ALL`,
      },
    ];
  }

  private _initRightColumn() {
    return [
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.sell_type'),
        value: this.merchantSellType(
          this.loanDetail?.merchant?.merchantSellType
        ),
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.approved_at'),
        value: this.loanDetail?.approvedAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'HH:mm:ss dd/MM/yyyy',
      },
      // {
      //   title: this.multiLanguageService.instant('bnpl.loan_info.repayment_at'),
      //   value: this.loanDetail?.completedAt,
      //   type: DATA_CELL_TYPE.DATETIME,
      //   format: 'HH:mm:ss dd/MM/yyyy',
      // },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.completed_at'),
        value: this.loanDetail?.completedAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'HH:mm:ss dd/MM/yyyy',
      },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.staff'),
        value:
          this.loanDetail?.adminAccountEntity?.username ||
          this.loanDetail?.staffId,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.bnpl_status'),
        value: this.loanDetail?.status,
        externalValue: this.loanDetail?.periodTimes,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.BNPL_STATUS,
      },
      {
        title: this.multiLanguageService.instant('bnpl.loan_info.debt_status'),
        value: this.loanDetail?.isBadDebt,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.PL_DEBT_STATUS,
      },
    ];
  }

  changeLoanStatus(status) {
    this.triggerChangeStatusBnplApplication.emit({
      id: this.loanDetail?.id,
      status: status,
      loanInfo: this.loanDetail,
    });
  }

  repaymentSinglePeriod() {
    this.triggerRepaymentBnplApplication.emit({
      id: this.loanDetail?.id,
      type: BNPL_PAYMENT_TYPE.SINGLE_PERIOD,
    });
  }

  repaymentAllPeriod() {
    this.triggerRepaymentBnplApplication.emit({
      id: this.loanDetail?.id,
      type: BNPL_PAYMENT_TYPE.ALL_PERIOD,
    });
  }

  merchantSellType(sellType) {
    if (!sellType) return null;
    if (sellType === 'ALL') {
      return (
        this.multiLanguageService.instant(MERCHANT_SELL_TYPE_TEXT.OFFLINE) +
        ', ' +
        this.multiLanguageService.instant(MERCHANT_SELL_TYPE_TEXT.ONLINE)
      );
    }
    return this.multiLanguageService.instant(MERCHANT_SELL_TYPE_TEXT[sellType]);
  }
}
