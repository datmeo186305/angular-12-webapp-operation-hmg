import { NotificationService } from 'src/app/core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateLoanStatusRequest } from '../../../../../../../open-api-modules/loanapp-tng-api-docs';
import { Subscription } from 'rxjs';
import { PaydayLoanControllerService as PaydayLoanHmgControllerService } from './../../../../../../../open-api-modules/loanapp-hmg-api-docs/api/paydayLoanController.service';
import { PaydayLoanControllerService as PaydayLoanTngControllerService } from './../../../../../../../open-api-modules/loanapp-tng-api-docs/api/paydayLoanController.service';
import {
  APPLICATION_TYPE,
  COMPANY_NAME,
  PAYDAY_LOAN_STATUS,
  TERM_TYPE,
} from '../../../../../core/common/enum/payday-loan';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import * as moment from 'moment';
import {
  CustomerInfo,
  PaydayLoanTng,
} from 'open-api-modules/dashboard-api-docs';
import { FormBuilder, FormGroup } from '@angular/forms';
import formatPunishStartTimeHmg from '../../../../../core/utils/format-punish-start-time-hmg';
import formatPunishStartTimeTng from '../../../../../core/utils/format-punish-start-time-tng';
import { environment } from '../../../../../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionConstants } from '../../../../../core/common/constants/permission-constants';

@Component({
  selector: 'app-loan-detail-info',
  templateUrl: './loan-detail-info.component.html',
  styleUrls: ['./loan-detail-info.component.scss'],
})
export class LoanDetailInfoComponent implements OnInit, OnDestroy {
  _loanId: string;
  @Input()
  get loanId(): string {
    return this._loanId;
  }

  set loanId(value: string) {
    this._loanId = value;
  }

  customerId: string = '';

  _customerInfo: CustomerInfo;
  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._customerInfo = value;
    this.leftColumn = this._initLeftColumn();
    this.middleColumn = this._initMiddleColumn();
    this.rightColumn = this._initRightColumn();
    this._initLoanInfoData();
  }

  _loanDetail: PaydayLoanTng;
  @Input()
  get loanDetail(): PaydayLoanTng {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoanTng) {
    this._loanDetail = value;
    this.getChangeLoanStatus();
    this.leftColumn = this._initLeftColumn();
    this.middleColumn = this._initMiddleColumn();
    this.rightColumn = this._initRightColumn();
    this.serviceFeeHmg = this._serviceFeeHmg();
    this.serviceFeeTng = this._serviceFeeTng();
    this.serviceFeeVac = this._serviceFeeVac();
    this._initLoanInfoData();
  }

  @Input() groupName: string;

  leftColumn: any[] = [];
  middleColumn: any[] = [];
  rightColumn: any[] = [];
  serviceFeeHmg: any[] = [];
  serviceFeeTng: any[] = [];
  serviceFeeVac: any[] = [];
  nextLoanStatus: PAYDAY_LOAN_STATUS = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
  nextLoanStatusDisplay: string;
  prevLoanStatus: PAYDAY_LOAN_STATUS;
  prevLoanStatusDisplay: string;
  rejectLoanStatus: PAYDAY_LOAN_STATUS = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
  rejectLoanStatusDisplay: string;
  salaryStatus: string;
  loanInfoForm: FormGroup;
  totalSettlementAmount: number;
  maxLoanAmount: number;
  warningText: string = '';
  userHasPermissions = {
    loanTngChangeStatus: {
      initialized: false,
      auction: false,
      document_awaiting: false,
      documentation_complete: false,
      funded: false,
      contract_accepted: false,
      awaiting_disbursement: false,
      disbursed: false,
      in_repayment: false,
      completed: false,
      rejected: false,
      withdraw: false,
      contract_rejected: false,
    },
    loanVacChangeStatus: {
      initialized: false,
      auction: false,
      document_awaiting: false,
      documentation_complete: false,
      funded: false,
      contract_awaiting: false,
      contract_accepted: false,
      awaiting_disbursement: false,
      disbursed: false,
      in_repayment: false,
      completed: false,
      rejected: false,
      withdraw: false,
      contract_rejected: false,
    },
  };

  subManager = new Subscription();
  @Output() loanDetailDetectChangeStatus = new EventEmitter<any>();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private paydayLoanHmgControllerService: PaydayLoanHmgControllerService,
    private paydayLoanTngControllerService: PaydayLoanTngControllerService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder,
    private permissionsService: NgxPermissionsService
  ) {
    this.loanInfoForm = this.formBuilder.group({
      note: [''],
    });
  }

  ngOnInit(): void {
    this._initSubscription();
  }

  private _initSubscription() {
    this.subManager.add(
      this.permissionsService.permissions$.subscribe((permissions) => {
        if (permissions) {
          this._checkUserPermissions();
        }
      })
    );
  }

  private _initLeftColumn() {
    return [
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.loan_code'
        ),
        value: this.loanDetail?.loanCode,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.customer_name'
        ),
        value: this.customerInfo?.firstName,
        type: DATA_CELL_TYPE.HYPERLINK,
        format: `/customer/list?id__e=${this.loanDetail?.customerId}&accountClassification=ALL`,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.phone_number'
        ),
        value: this.customerInfo?.mobileNumber,
        type: DATA_CELL_TYPE.HYPERLINK,
        format: `/customer/list?id__e=${this.loanDetail?.customerId}&accountClassification=ALL`,
      },
      // {
      //   title: this.multiLanguageService.instant(
      //     'loan_app.loan_info.salary_status'
      //   ),
      //   value: this.getSalaryStatus(this.loanDetail?.expectedTenure),
      //   type: DATA_CELL_TYPE.STATUS,
      //   format: DATA_STATUS_TYPE.PL_OTHER_STATUS,
      // },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.created_at'
        ),
        value: this.loanDetail?.createdAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.approved_at'
        ),
        value: this.loanDetail?.approvedAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.disbursed_at'
        ),
        value: this.loanDetail?.disbursedAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.completed_at'
        ),
        value: this.loanDetail?.completedAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.updated_at'
        ),
        value: this.loanDetail?.updatedAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
    ];
  }

  private _initMiddleColumn() {
    this.maxLoanAmount = this.getMaxLoanAmount(
      this.loanDetail?.companyInfo?.groupName
    );
    this.totalSettlementAmount = this.getTotalSettlementAmount();
    return [
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.max_loan_amount'
        ),
        value: this.maxLoanAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.loan_amount'
        ),
        value: this.loanDetail?.expectedAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.total_service_charge'
        ),
        value: this.loanDetail?.totalServiceFees,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.actual_received_amount'
        ),
        value: this.loanDetail?.actualAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.loan_term'
        ),
        value: this.loanDetail?.expectedTenure,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.overdue_date'
        ),
        value: this.getOverdueDate(),
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.overdue_date_count'
        ),
        value: this.getOverdueDateCount(),
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.late_payment_fee'
        ),
        value: this.loanDetail?.latePenaltyPayment,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.total_settlement_amount'
        ),
        value: this.totalSettlementAmount,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      // {
      //   title: this.multiLanguageService.instant(
      //     'loan_app.loan_info.total_paid_amount'
      //   ),
      //   value: this.loanDetail?.totalPaidAmount,
      //   type: DATA_CELL_TYPE.CURRENCY,
      //   format: null,
      // },
    ];
  }

  private _initRightColumn() {
    let newDataStatusType: DATA_STATUS_TYPE;
    switch (this.groupName) {
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

    return [
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.voucher_code'
        ),
        value: this.loanDetail?.voucher?.code,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.loan_status'
        ),
        value: this.loanDetail?.status,
        type: DATA_CELL_TYPE.STATUS,
        format: newDataStatusType,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.payment_status'
        ),
        value: this.loanDetail?.repaymentStatus,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.PL_REPAYMENT_STATUS,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.debt_status'
        ),
        value: this.loanDetail?.defaultStatus,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.PL_DEBT_STATUS,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.term_type'
        ),
        value: this.loanDetail?.termType,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.PL_TERM_TYPE,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.loan_info.loan_purpose'
        ),
        value: this.loanDetail?.purpose,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  private _serviceFeeHmg() {
    return [
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.service_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.service_fee_hmg'
        ),
        value: this.calculateServiceFee(this.loanDetail),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.transaction_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.transaction_fee_description'
        ),
        value: environment.TRANSACTION_FEE,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.discount_fee'
        ),
        subTitle: null,
        value: this.loanDetail?.voucherTransaction?.discountValue,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.total_fee'
        ),
        subTitle: null,
        value: this.loanDetail?.totalServiceFees,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
    ];
  }

  private _serviceFeeTng() {
    return [
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.service_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.service_fee_tng'
        ),
        value: this.calculateServiceFee(this.loanDetail),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.transaction_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.transaction_fee_description'
        ),
        value: environment.TRANSACTION_FEE,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.discount_fee'
        ),
        subTitle: null,
        value: this.loanDetail?.voucherTransaction?.discountValue,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.vat_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.vat_fee_description'
        ),
        value:
          environment.TAX_FEE_TNG *
          (this.calculateServiceFee(this.loanDetail) -
            (this.loanDetail?.voucherTransaction?.discountValue
              ? this.loanDetail?.voucherTransaction?.discountValue
              : 0)),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.total_fee'
        ),
        subTitle: null,
        value: this.loanDetail?.totalServiceFees,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
    ];
  }

  private _getSubtitleFeeVac() {
    if (
      this.loanDetail?.applicationType === APPLICATION_TYPE.PDL_VAC_OFFICE &&
      this.loanDetail?.termType === TERM_TYPE.THREE_MONTH
    ) {
      return this.multiLanguageService.instant(
        'payday_loan.service_fee.service_fee_vac_office_three_month'
      );
    } else if (
      this.loanDetail?.applicationType === APPLICATION_TYPE.PDL_VAC_OFFICE &&
      this.loanDetail?.termType === TERM_TYPE.ONE_MONTH
    ) {
      return this.multiLanguageService.instant(
        'payday_loan.service_fee.service_fee_vac_office_one_month'
      );
    } else {
      return this.multiLanguageService.instant(
        'payday_loan.service_fee.service_fee_vac_factory'
      );
    }
  }

  private _serviceFeeVac() {
    return [
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.service_fee'
        ),
        subTitle: this._getSubtitleFeeVac(),
        value: this.calculateServiceFee(this.loanDetail),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.transaction_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.transaction_fee_description'
        ),
        // value: environment.TRANSACTION_FEE,
        value:
          this.loanDetail?.termType === TERM_TYPE.THREE_MONTH
            ? environment.FIXED_REPAYMENT_VA_FEE * 3 +
              environment.FIXED_DISBURSEMENT_FEE
            : environment.TRANSACTION_FEE,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.discount_fee'
        ),
        subTitle: null,
        value: this.loanDetail?.voucherTransaction?.discountValue,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.vat_fee'
        ),
        subTitle: this.multiLanguageService.instant(
          'payday_loan.service_fee.vat_fee_description'
        ),
        value:
          environment.TAX_FEE_TNG *
          (this.calculateServiceFee(this.loanDetail) -
            (this.loanDetail?.voucherTransaction?.discountValue
              ? this.loanDetail?.voucherTransaction?.discountValue
              : 0)),
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'payday_loan.service_fee.total_fee'
        ),
        subTitle: null,
        value: this.loanDetail?.totalServiceFees,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
    ];
  }

  changeLoanStatus(newStatus, newStatusDisplay) {
    const currentLoanStatusDisplay = this.multiLanguageService.instant(
      `payday_loan.status.${this.loanDetail?.status.toLowerCase()}`
    );

    if (
      this.isNotMatchedCustomerInfo() &&
      newStatus === PAYDAY_LOAN_STATUS.AUCTION &&
      this.groupName === COMPANY_NAME.VAC
    ) {
      this.warningText =
        '</br>' +
        this.multiLanguageService.instant(
          'loan_app.loan_info.not_matched_info'
        );
    } else {
      this.warningText = '';
    }

    let promptDialogRef = this.notificationService.openPrompt({
      title: this.multiLanguageService.instant('common.are_you_sure'),
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
      content:
        this.multiLanguageService.instant(
          'loan_app.loan_info.confirm_change_status_description',
          {
            loan_code: this.loanDetail?.loanCode,
            current_loan_status: currentLoanStatusDisplay,
            new_loan_status: newStatusDisplay,
          }
        ) + this.warningText,
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    this.subManager.add(
      promptDialogRef.afterClosed().subscribe((buttonType: BUTTON_TYPE) => {
        if (buttonType === BUTTON_TYPE.PRIMARY) {
          this.confirmChangeStatus(newStatus);
        }
      })
    );
  }

  hasPermissionChangeStatus(status) {
    let canDoPermissions = [];
    switch (this.groupName) {
      case COMPANY_NAME.TNG:
        canDoPermissions.push(this.hasPermissionChangeStatusTngLoan(status));
        break;
      case COMPANY_NAME.HMG:
        canDoPermissions.push(this.hasPermissionChangeStatusHmgLoan(status));
        break;
      case COMPANY_NAME.VAC:
        canDoPermissions.push(this.hasPermissionChangeStatusVACLoan(status));
        break;
      default:
        break;
    }
    console.log('canDoPermissions', canDoPermissions);
    return canDoPermissions;
  }

  private hasPermissionChangeStatusTngLoan(status) {
    switch (status) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        return 'paydays:updateStatusInitializeTngLoan';
      case PAYDAY_LOAN_STATUS.AUCTION:
        return 'paydays:updateStatusPendingForMatchingTngLoan';
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        return 'paydays:updateStatusDocumentAwaitingTngLoan';
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        return 'paydays:updateStatusDocumentCompleteTngLoan';
      case PAYDAY_LOAN_STATUS.FUNDED:
        return 'paydays:updateStatusAwaitingContractTngLoan';
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return 'paydays:updateStatusContractAcceptedTngLoan';
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return 'paydays:updateStatusAwaitingDisbursementTngLoan';
      case PAYDAY_LOAN_STATUS.DISBURSED:
        return 'paydays:updateStatusDisbursedTngLoan';
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        return 'paydays:updateStatusUnderRepaymentTngLoan';
      case PAYDAY_LOAN_STATUS.COMPLETED:
        return 'paydays:updateStatusCompletedTngLoan';
      case PAYDAY_LOAN_STATUS.REJECTED:
        return 'paydays:updateStatusRejectedTngLoan';
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return 'paydays:updateStatusWithdrawTngLoan';
      case PAYDAY_LOAN_STATUS.CONTRACT_REJECTED:
        return 'paydays:updateStatusContractRejectTngLoan';
      default:
        return 'paydays:changeLoanStatusTng';
    }
  }

  private async hasPermissionChangeStatusHmgLoan(status) {
    return 'hmgPaydayLoans:changeLoanStatus';
  }

  private async hasPermissionChangeStatusVACLoan(status) {
    switch (status) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        return 'paydays:updateStatusInitializeVacLoan';
      case PAYDAY_LOAN_STATUS.AUCTION:
        return 'paydays:updateStatusPendingForMatchingVacLoan';
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        return 'paydays:updateStatusDocumentAwaitingVacLoan';
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        return 'paydays:updateStatusDocumentCompleteVacLoan';
      case PAYDAY_LOAN_STATUS.FUNDED:
        return 'paydays:updateStatusAwaitingContractVacLoan';
      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
        return 'paydays:updateStatusAwaitingContractVacLoan';
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return 'paydays:updateStatusContractAcceptedVacLoan';
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return 'paydays:updateStatusAwaitingDisbursementVacLoan';
      case PAYDAY_LOAN_STATUS.DISBURSED:
        return 'paydays:updateStatusDisbursedVacLoan';
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        return 'paydays:updateStatusUnderRepaymentVacLoan';
      case PAYDAY_LOAN_STATUS.COMPLETED:
        return 'paydays:updateStatusCompletedVacLoan';
      case PAYDAY_LOAN_STATUS.REJECTED:
        return 'paydays:updateStatusRejectedVacLoan';
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return 'paydays:updateStatusWithdrawVacLoan';
      case PAYDAY_LOAN_STATUS.CONTRACT_REJECTED:
        return 'paydays:updateStatusContractRejectVacLoan';
      default:
        return 'paydays:changeLoanStatusVac';
    }
  }

  confirmChangeStatus(newStatus) {
    const updateLoanStatusRequest: UpdateLoanStatusRequest = {
      customerId: this.loanDetail?.customerId,
      status: newStatus,
      applicationType: APPLICATION_TYPE.PDL_TNG,
    };

    switch (this.groupName) {
      case COMPANY_NAME.HMG:
        updateLoanStatusRequest.applicationType = APPLICATION_TYPE.PDL_HMG;
        this.changePaydayLoanHMGStatus(updateLoanStatusRequest);
        break;
      case COMPANY_NAME.TNG:
        updateLoanStatusRequest.applicationType = APPLICATION_TYPE.PDL_TNG;
        this.changePaydayLoanStatus(updateLoanStatusRequest);
        break;
      case COMPANY_NAME.VAC:
        updateLoanStatusRequest.applicationType =
          this.loanDetail?.applicationType;
        this.changePaydayLoanStatus(updateLoanStatusRequest);
        break;
      default:
        break;
    }
  }

  changePaydayLoanHMGStatus(updateLoanStatusRequest: UpdateLoanStatusRequest) {
    this.subManager.add(
      this.paydayLoanHmgControllerService
        .changeLoanStatus(this.loanDetail?.id, updateLoanStatusRequest)
        .subscribe((result) => {
          if (result?.responseCode === 200) {
            this.loanDetailDetectChangeStatus.emit();
          } else {
            this.notifier.error(JSON.stringify(result?.message));
          }
        })
    );
  }

  changePaydayLoanStatus(updateLoanStatusRequest: UpdateLoanStatusRequest) {
    this.subManager.add(
      this.paydayLoanTngControllerService
        .changeLoanStatus(this.loanDetail?.id, updateLoanStatusRequest)
        .subscribe((result) => {
          if (result?.responseCode === 200) {
            this.loanDetailDetectChangeStatus.emit();
          } else {
            this.notifier.error(JSON.stringify(result?.message));
          }
        })
    );
  }

  //Trạng thái trả lương
  getSalaryStatus(expectedTenure) {
    if (!expectedTenure) return;
    if (expectedTenure === 0) {
      this.salaryStatus = this.multiLanguageService.instant(
        'loan_app.loan_info.received_salary'
      );
      return this.salaryStatus;
    }
    this.salaryStatus = this.multiLanguageService.instant(
      'loan_app.loan_info.not_received_salary'
    );
    return this.salaryStatus;
  }

  //Số tiền vay tối đa
  getMaxLoanAmount(companyGroupName: string) {
    let annualIncome = this.customerInfo?.annualIncome;

    if (
      this.loanDetail?.status === PAYDAY_LOAN_STATUS.COMPLETED ||
      this.loanDetail?.status === PAYDAY_LOAN_STATUS.REJECTED ||
      this.loanDetail?.status === PAYDAY_LOAN_STATUS.WITHDRAW ||
      this.loanDetail?.status === PAYDAY_LOAN_STATUS.CONTRACT_REJECTED
    ) {
      annualIncome =
        this.loanDetail?.transactionHistory?.personalData?.annualIncome ||
        this.customerInfo?.annualIncome;
    }

    switch (companyGroupName) {
      case COMPANY_NAME.HMG:
        return this.getMaxHMGValue(annualIncome);
      case COMPANY_NAME.TNG:
        return this.getMaxTNGValue(annualIncome);
      case COMPANY_NAME.VAC:
        return this.getMaxVacValue(annualIncome);
      default:
        return null;
    }
  }

  getMaxTNGValue(annualIncome) {
    let millionAnnualIncome =
      (this.getPercentOfSalaryByDay() * annualIncome) / 1000000;
    if (millionAnnualIncome % 1 >= 0.5) {
      return (Math.round(millionAnnualIncome) - 0.5) * 1000000;
    }
    return Math.floor(millionAnnualIncome) * 1000000;
  }

  getMaxVacValue(annualIncome) {
    if (
      this.loanDetail?.applicationType === APPLICATION_TYPE.PDL_VAC_OFFICE &&
      this.loanDetail?.termType === TERM_TYPE.THREE_MONTH
    ) {
      return annualIncome * environment.MAX_LOAN_VAC_OFFICE_THREE_MONTH_PERCENT;
    } else if (
      this.loanDetail?.applicationType === APPLICATION_TYPE.PDL_VAC_OFFICE &&
      this.loanDetail?.termType === TERM_TYPE.ONE_MONTH
    ) {
      return annualIncome * environment.MAX_LOAN_VAC_OFFICE_ONE_MONTH_PERCENT;
    } else {
      return annualIncome * environment.MAX_LOAN_VAC_FACTORY_PERCENT;
    }
  }

  getPercentOfSalaryByDay() {
    let createdAtDay = moment(new Date(this.loanDetail.createdAt)).format('DD');
    switch (createdAtDay) {
      case '10':
      case '11':
      case '12':
      case '13':
      case '14':
      case '15':
      case '16':
        return 50.0 / 100;
      case '17':
      case '18':
        return 57.5 / 100;
      case '19':
      case '20':
        return 65.0 / 100;
      case '21':
      case '22':
        return 72.5 / 100;
      default:
        return 80 / 100;
    }
  }

  getMaxHMGValue(annualIncome) {
    let millionAnnualIncome =
      (environment.MAX_PERCENT_AMOUNT * annualIncome) / 1000000;

    if (millionAnnualIncome % 1 >= 0.5) {
      return (Math.round(millionAnnualIncome) - 0.5) * 1000000;
    }

    return Math.floor(millionAnnualIncome) * 1000000;
  }

  //Tổng tiền tất toán
  getTotalSettlementAmount() {
    return (
      this.loanDetail?.latePenaltyPayment + this.loanDetail?.expectedAmount
    );
  }

  getChangeLoanStatus() {
    if (!this.loanDetail?.status) return;
    switch (this.groupName) {
      case COMPANY_NAME.HMG:
        this.getChangeLoanHmgStatus();
        break;
      case COMPANY_NAME.TNG:
        this.getChangeLoanTngStatus();
        break;
      case COMPANY_NAME.VAC:
        this.getChangeLoanVacStatus();
        break;
      default:
        break;
    }
  }

  //Trạng thái khoản vay được phép thay đổi
  getChangeLoanHmgStatus() {
    if (!this.loanDetail?.status) return;
    const currentLoanStatus = this.loanDetail?.status;
    switch (currentLoanStatus) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        this.prevLoanStatus = PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.AUCTION;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.REJECTED;
        break;

      case PAYDAY_LOAN_STATUS.AUCTION:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.FUNDED;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.FUNDED:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        this.prevLoanStatus = PAYDAY_LOAN_STATUS.FUNDED;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        this.prevLoanStatus = PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.DISBURSED;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.DISBURSED:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.IN_REPAYMENT;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.WITHDRAW;
        break;

      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.COMPLETED;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        break;

      default:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        break;
    }

    this.nextLoanStatusDisplay = this.multiLanguageService.instant(
      `payday_loan.status.${this.nextLoanStatus.toLowerCase()}`
    );
    this.rejectLoanStatusDisplay = this.multiLanguageService.instant(
      `payday_loan.status.${this.rejectLoanStatus.toLowerCase()}_action`
    );
    this.prevLoanStatusDisplay = this.prevLoanStatus
      ? this.multiLanguageService.instant(
          `payday_loan.status.${this.prevLoanStatus.toLowerCase()}`
        )
      : null;

    return;
  }

  async getChangeLoanTngStatus() {
    if (!this.loanDetail?.status) return;
    const currentLoanStatus = this.loanDetail?.status;
    switch (currentLoanStatus) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING
        );
        this.rejectLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE
        );
        this.rejectLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        this.prevLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING
        );
        this.nextLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.AUCTION
        );
        this.rejectLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.REJECTED
        );
        break;

      case PAYDAY_LOAN_STATUS.AUCTION:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.FUNDED
        );
        this.rejectLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.FUNDED:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED
        );
        this.rejectLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        this.rejectLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        this.prevLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.FUNDED
        );
        this.nextLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT
        );
        this.rejectLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        this.prevLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED
        );
        this.nextLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.DISBURSED
        );
        this.rejectLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.DISBURSED:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.IN_REPAYMENT
        );
        this.rejectLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanTng(
          PAYDAY_LOAN_STATUS.COMPLETED
        );
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        break;

      default:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        break;
    }

    this.nextLoanStatusDisplay = this.nextLoanStatus
      ? this.multiLanguageService.instant(
          `payday_loan.status.${this.nextLoanStatus.toLowerCase()}`
        )
      : null;

    this.rejectLoanStatusDisplay = this.rejectLoanStatus
      ? this.multiLanguageService.instant(
          `payday_loan.status.${this.rejectLoanStatus.toLowerCase()}_action`
        )
      : null;

    this.prevLoanStatusDisplay = this.prevLoanStatus
      ? this.multiLanguageService.instant(
          `payday_loan.status.${this.prevLoanStatus.toLowerCase()}`
        )
      : null;

    return;
  }

  isNotMatchedCustomerInfo() {
    if (this.loanDetail?.status != PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE) {
      return false;
    }

    if (this.loanDetail?.employeeData?.name !== this.customerInfo?.firstName) {
      return true;
    }

    if (
      this.loanDetail?.employeeData?.mobile !== this.customerInfo?.mobileNumber
    ) {
      return true;
    }

    if (
      this.loanDetail?.employeeData?.identityNumber !==
      this.customerInfo?.identityNumberOne
    ) {
      return true;
    }

    if (
      this.loanDetail?.employeeData?.bankCode !== this.customerInfo?.bankCode
    ) {
      return true;
    }

    if (
      this.loanDetail?.employeeData?.bankName !== this.customerInfo?.bankName
    ) {
      return true;
    }

    if (
      this.loanDetail?.employeeData?.accountNumber !==
      this.customerInfo?.accountNumber
    ) {
      return true;
    }

    return false;
  }

  async getChangeLoanVacStatus() {
    if (!this.loanDetail?.status) return;
    const currentLoanStatus = this.loanDetail?.status;
    switch (currentLoanStatus) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING
        );
        this.rejectLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE
        );
        this.rejectLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        this.prevLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING
        );
        this.nextLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.AUCTION
        );
        this.rejectLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.REJECTED
        );
        break;

      case PAYDAY_LOAN_STATUS.AUCTION:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.FUNDED
        );
        this.rejectLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.FUNDED:
        this.prevLoanStatus = null;
        if (this.loanDetail?.termType === TERM_TYPE.ONE_MONTH) {
          this.nextLoanStatus = await this.getValidStatusLoanVac(
            PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED
          );
        } else {
          this.nextLoanStatus = await this.getValidStatusLoanVac(
            PAYDAY_LOAN_STATUS.CONTRACT_AWAITING
          );
        }
        this.rejectLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
        this.prevLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.FUNDED
        );
        this.nextLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED
        );
        this.rejectLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        if (this.loanDetail?.termType === TERM_TYPE.ONE_MONTH) {
          this.prevLoanStatus = await this.getValidStatusLoanVac(
            PAYDAY_LOAN_STATUS.FUNDED
          );
        } else {
          this.prevLoanStatus = await this.getValidStatusLoanVac(
            PAYDAY_LOAN_STATUS.CONTRACT_AWAITING
          );
        }
        this.nextLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT
        );
        this.rejectLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        this.prevLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED
        );
        this.nextLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.DISBURSED
        );
        this.rejectLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.DISBURSED:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.IN_REPAYMENT
        );
        this.rejectLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.WITHDRAW
        );
        break;

      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        this.prevLoanStatus = null;
        this.nextLoanStatus = await this.getValidStatusLoanVac(
          PAYDAY_LOAN_STATUS.COMPLETED
        );
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        break;

      default:
        this.prevLoanStatus = null;
        this.nextLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        this.rejectLoanStatus = PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
        break;
    }

    this.nextLoanStatusDisplay = this.nextLoanStatus
      ? this.multiLanguageService.instant(
          `payday_loan.status.${this.nextLoanStatus.toLowerCase()}`
        )
      : null;

    this.rejectLoanStatusDisplay = this.rejectLoanStatus
      ? this.multiLanguageService.instant(
          `payday_loan.status.${this.rejectLoanStatus.toLowerCase()}_action`
        )
      : null;

    this.prevLoanStatusDisplay = this.prevLoanStatus
      ? this.multiLanguageService.instant(
          `payday_loan.status.${this.prevLoanStatus.toLowerCase()}`
        )
      : null;

    return;
  }

  async getValidStatusLoanVac(status) {
    return (await this._getPermissionChangeStatusLoanVac(status))
      ? status
      : PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
  }

  async getValidStatusLoanTng(status) {
    return (await this._getPermissionChangeStatusLoanTng(status))
      ? status
      : PAYDAY_LOAN_STATUS.UNKNOWN_STATUS;
  }

  formatTime(time) {
    if (!time) return;
    return moment(new Date(time), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY HH:mm A'
    );
  }

  private _initLoanInfoData() {
    this.loanInfoForm.patchValue({
      note: this.loanDetail?.note,
    });
  }

  getOverdueDate() {
    if (this.loanDetail?.companyInfo?.groupName === COMPANY_NAME.HMG) {
      return formatPunishStartTimeHmg(
        this.loanDetail?.createdAt,
        this.loanDetail?.expectedTenure
      );
    } else {
      return formatPunishStartTimeTng(
        this.loanDetail?.createdAt,
        this.loanDetail?.expectedTenure
      );
    }
  }

  getOverdueDateCount() {
    switch (this.loanDetail?.status) {
      case PAYDAY_LOAN_STATUS.COMPLETED:
        return moment(this.loanDetail?.completedAt).diff(
          this.loanDetail?.settlementDate,
          'days'
        ) < 0
          ? 'N/A'
          : moment(this.loanDetail?.completedAt).diff(
              this.loanDetail?.settlementDate,
              'days'
            );
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        return moment().diff(this.loanDetail?.settlementDate, 'days') < 0
          ? 'N/A'
          : moment().diff(this.loanDetail?.settlementDate, 'days');

      default:
        return 'N/A';
    }
  }

  calculateServiceFee(loanDetail) {
    switch (loanDetail?.companyInfo?.groupName) {
      case COMPANY_NAME.TNG:
        return this.calculateServiceFeeTNG(loanDetail);
      case COMPANY_NAME.HMG:
        return loanDetail?.expectedAmount * environment.FEE_HMG_PERCENT;
      case COMPANY_NAME.VAC:
        return this.calculateServiceFeeVAC(loanDetail);
      default:
        return null;
    }
  }

  calculateServiceFeeTNG(loanDetail) {
    if (
      loanDetail?.expectedAmount * environment.FEE_TNG_PERCENT <
      environment.MINIMUM_SERVICE_FEE_TNG
    ) {
      return environment.MINIMUM_SERVICE_FEE_TNG;
    } else {
      return loanDetail?.expectedAmount * environment.FEE_TNG_PERCENT;
    }
  }

  calculateServiceFeeVAC(loanDetail) {
    let serviceFee = 0;
    if (loanDetail?.applicationType === APPLICATION_TYPE.PDL_VAC_OFFICE) {
      if (loanDetail?.termType === TERM_TYPE.THREE_MONTH) {
        serviceFee =
          loanDetail?.expectedAmount *
          environment.FEE_VAC_OFFICE_THREE_MONTH_PERCENT;

        return serviceFee <
          environment.MINIMUM_SERVICE_FEE_VAC_OFFICE_THREE_MONTH
          ? environment.MINIMUM_SERVICE_FEE_VAC_OFFICE_THREE_MONTH
          : serviceFee;
      }
      if (loanDetail?.termType === TERM_TYPE.ONE_MONTH) {
        serviceFee =
          loanDetail?.expectedAmount *
          environment.FEE_VAC_OFFICE_ONE_MONTH_PERCENT;

        return serviceFee < environment.MINIMUM_SERVICE_FEE_VAC_OFFICE_ONE_MONTH
          ? environment.MINIMUM_SERVICE_FEE_VAC_OFFICE_ONE_MONTH
          : serviceFee;
      }
    } else {
      serviceFee =
        loanDetail?.expectedAmount * environment.FEE_VAC_FACTORY_PERCENT;

      return serviceFee < environment.MINIMUM_SERVICE_FEE_VAC_FACTORY
        ? environment.MINIMUM_SERVICE_FEE_VAC_FACTORY
        : serviceFee;
    }
    return serviceFee;
  }

  private async _checkUserPermissions() {
    switch (this.groupName) {
      case COMPANY_NAME.TNG:
        await this._checkPermissionTng();
        break;
      case COMPANY_NAME.VAC:
        await this._checkPermissionVac();
        break;
      default:
        break;
    }
  }

  private async _getPermissionChangeStatusLoanTng(loanStatus) {
    await this._checkPermissionTng();
    switch (loanStatus) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        return this.userHasPermissions.loanTngChangeStatus.initialized;
      case PAYDAY_LOAN_STATUS.AUCTION:
        return this.userHasPermissions.loanTngChangeStatus.auction;
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        return this.userHasPermissions.loanTngChangeStatus.document_awaiting;
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        return this.userHasPermissions.loanTngChangeStatus
          .documentation_complete;
      case PAYDAY_LOAN_STATUS.FUNDED:
        return this.userHasPermissions.loanTngChangeStatus.funded;
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return this.userHasPermissions.loanTngChangeStatus.contract_accepted;
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return this.userHasPermissions.loanTngChangeStatus
          .awaiting_disbursement;
      case PAYDAY_LOAN_STATUS.DISBURSED:
        return this.userHasPermissions.loanTngChangeStatus.disbursed;
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        return this.userHasPermissions.loanTngChangeStatus.in_repayment;
      case PAYDAY_LOAN_STATUS.COMPLETED:
        return this.userHasPermissions.loanTngChangeStatus.completed;
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return this.userHasPermissions.loanTngChangeStatus.withdraw;
      case PAYDAY_LOAN_STATUS.CONTRACT_REJECTED:
        return this.userHasPermissions.loanTngChangeStatus.contract_rejected;
      case PAYDAY_LOAN_STATUS.REJECTED:
        return this.userHasPermissions.loanTngChangeStatus.rejected;
      default:
        return false;
    }
  }

  private async _getPermissionChangeStatusLoanVac(loanStatus) {
    await this._checkPermissionVac();
    switch (loanStatus) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        return this.userHasPermissions.loanVacChangeStatus.initialized;
      case PAYDAY_LOAN_STATUS.AUCTION:
        return this.userHasPermissions.loanVacChangeStatus.auction;
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        return this.userHasPermissions.loanVacChangeStatus.document_awaiting;
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        return this.userHasPermissions.loanVacChangeStatus
          .documentation_complete;
      case PAYDAY_LOAN_STATUS.FUNDED:
        return this.userHasPermissions.loanVacChangeStatus.funded;
      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
        return this.userHasPermissions.loanVacChangeStatus.contract_awaiting;
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return this.userHasPermissions.loanVacChangeStatus.contract_accepted;
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return this.userHasPermissions.loanVacChangeStatus
          .awaiting_disbursement;
      case PAYDAY_LOAN_STATUS.DISBURSED:
        return this.userHasPermissions.loanVacChangeStatus.disbursed;
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        return this.userHasPermissions.loanVacChangeStatus.in_repayment;
      case PAYDAY_LOAN_STATUS.COMPLETED:
        return this.userHasPermissions.loanVacChangeStatus.completed;
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return this.userHasPermissions.loanVacChangeStatus.withdraw;
      case PAYDAY_LOAN_STATUS.CONTRACT_REJECTED:
        return this.userHasPermissions.loanVacChangeStatus.contract_rejected;
      case PAYDAY_LOAN_STATUS.REJECTED:
        return this.userHasPermissions.loanVacChangeStatus.rejected;
      default:
        return false;
    }
  }

  private async _checkPermissionTng() {
    this.userHasPermissions.loanTngChangeStatus.initialized =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.INITIALIZED
      );
    this.userHasPermissions.loanTngChangeStatus.auction =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.AUCTION
      );
    this.userHasPermissions.loanTngChangeStatus.document_awaiting =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.DOCUMENT_AWAITING
      );
    this.userHasPermissions.loanTngChangeStatus.documentation_complete =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.DOCUMENTATION_COMPLETE
      );
    this.userHasPermissions.loanTngChangeStatus.funded =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.FUNDED
      );
    this.userHasPermissions.loanTngChangeStatus.contract_accepted =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.CONTRACT_ACCEPTED
      );
    this.userHasPermissions.loanTngChangeStatus.awaiting_disbursement =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.AWAITING_DISBURSEMENT
      );
    this.userHasPermissions.loanTngChangeStatus.disbursed =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.DISBURSED
      );
    this.userHasPermissions.loanTngChangeStatus.in_repayment =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.IN_REPAYMENT
      );
    this.userHasPermissions.loanTngChangeStatus.completed =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.COMPLETED
      );
    this.userHasPermissions.loanTngChangeStatus.rejected =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.REJECTED
      );
    this.userHasPermissions.loanTngChangeStatus.withdraw =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.WITHDRAW
      );
    this.userHasPermissions.loanTngChangeStatus.contract_rejected =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_TNG_STATUS_PERMISSION.CONTRACT_REJECTED
      );
  }

  private async _checkPermissionVac() {
    this.userHasPermissions.loanVacChangeStatus.initialized =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.INITIALIZED
      );
    this.userHasPermissions.loanVacChangeStatus.auction =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.AUCTION
      );
    this.userHasPermissions.loanVacChangeStatus.document_awaiting =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.DOCUMENT_AWAITING
      );
    this.userHasPermissions.loanVacChangeStatus.documentation_complete =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.DOCUMENTATION_COMPLETE
      );
    this.userHasPermissions.loanVacChangeStatus.funded =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.FUNDED
      );
    this.userHasPermissions.loanVacChangeStatus.contract_awaiting =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.CONTRACT_ACCEPTED
      );
    this.userHasPermissions.loanVacChangeStatus.contract_accepted =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.CONTRACT_ACCEPTED
      );
    this.userHasPermissions.loanVacChangeStatus.awaiting_disbursement =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.AWAITING_DISBURSEMENT
      );
    this.userHasPermissions.loanVacChangeStatus.disbursed =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.DISBURSED
      );
    this.userHasPermissions.loanVacChangeStatus.in_repayment =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.IN_REPAYMENT
      );
    this.userHasPermissions.loanVacChangeStatus.completed =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.COMPLETED
      );
    this.userHasPermissions.loanVacChangeStatus.rejected =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.REJECTED
      );
    this.userHasPermissions.loanVacChangeStatus.withdraw =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.WITHDRAW
      );
    this.userHasPermissions.loanVacChangeStatus.contract_rejected =
      await this.permissionsService.hasPermission(
        PermissionConstants.CHANGE_LOAN_VAC_STATUS_PERMISSION.CONTRACT_REJECTED
      );
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
}
