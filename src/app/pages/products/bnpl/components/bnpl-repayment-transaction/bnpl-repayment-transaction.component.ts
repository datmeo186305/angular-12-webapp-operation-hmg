import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  BnplApplication,
  CustomerInfo,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { MatTableDataSource } from '@angular/material/table';
import { DisplayedFieldsModel } from '../../../../../public/models/filter/displayed-fields.model';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../../core/common/enum/operator';
import { Store } from '@ngrx/store';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import * as fromStore from '../../../../../core/store';
import {
  PAYMENT_METHOD,
  PAYMENT_METHOD_TEXT,
  REPAYMENT_STATUS,
} from '../../../../../core/common/enum/bnpl';

@Component({
  selector: 'app-bnpl-repayment-transaction',
  templateUrl: './bnpl-repayment-transaction.component.html',
  styleUrls: ['./bnpl-repayment-transaction.component.scss'],
})
export class BnplRepaymentTransactionComponent implements OnInit {
  _loanDetail: BnplApplication;
  @Input()
  get loanDetail(): BnplApplication {
    return this._loanDetail;
  }

  set loanDetail(value: BnplApplication) {
    this._loanDetail = value;
    this.initTableData();
  }
  @Input() userInfo: CustomerInfo;
  @Output() triggerChangeStatusBnplApplication = new EventEmitter<any>();
  @Output() triggerRepaymentBnplApplication = new EventEmitter<any>();

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  expandedElementLoanDetail: any;

  allColumns: DisplayedFieldsModel[] = [
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'bnpl.repayment_transaction.created_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm:ss',
      showed: true,
    },
    {
      key: 'amount',
      title: this.multiLanguageService.instant(
        'bnpl.repayment_transaction.amount'
      ),
      type: DATA_CELL_TYPE.CURRENCY,
      format: null,
      showed: true,
    },
    {
      key: 'providerName',
      title: this.multiLanguageService.instant(
        'bnpl.repayment_transaction.provider'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant(
        'bnpl.repayment_transaction.status'
      ),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.GPAY_REPAYMENT_STATUS,
      showed: true,
    },

    {
      key: 'actionBy',
      title: this.multiLanguageService.instant(
        'bnpl.repayment_transaction.action_by'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
  ];

  constructor(
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService
  ) {}

  ngOnInit(): void {}

  initTableData() {
    let repaymentTransactions = (this.dataSource.data =
      this.loanDetail?.repaymentTransactions);
    if (!repaymentTransactions) {
      return;
    }
    this.dataSource.data = repaymentTransactions.map((value) => {
      return {
        ...value,
        providerName: this.multiLanguageService.instant(
          PAYMENT_METHOD_TEXT[value.provider]
        ),
        actionBy:
          value.provider == PAYMENT_METHOD.IN_CASH
            ? value.adminAccountEntity?.username
            : this?.loanDetail?.customerInfo?.firstName,
      };
    });
  }

  changeLoanStatus(status) {
    this.triggerChangeStatusBnplApplication.emit({
      id: this.loanDetail?.id,
      status: status,
      loanInfo: this.loanDetail,
    });
  }

  repaymentSinglePeriod() {
    let payment = 0;
    this.triggerRepaymentBnplApplication.emit({
      id: this.loanDetail?.id,
      transactionAmount: payment,
    });
  }

  repaymentAllPeriod() {
    let payment = 0;
    this.triggerRepaymentBnplApplication.emit({
      id: this.loanDetail?.id,
      transactionAmount: payment,
    });
  }
}
