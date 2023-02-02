import {
  DEBT_STATUS,
  PAYDAY_LOAN_REPAYMENT_STATUS,
  TERM_TYPE,
} from './../../../../core/common/enum/payday-loan';
import { PlStatusLabelComponent } from './../pl-status-label/pl-status-label.component';
import {
  PAYDAY_LOAN_OTHER_STATUS,
  PAYDAY_LOAN_RATING_STATUS,
  PAYDAY_LOAN_STATUS,
  PAYDAY_LOAN_UI_STATUS,
  REPAYMENT_STATUS,
} from '../../../../core/common/enum/payday-loan';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DATA_STATUS_TYPE } from '../../../../core/common/enum/operator';
import { PL_LABEL_STATUS } from '../../../../core/common/enum/label-status';
import { MultiLanguageService } from '../../../translate/multiLanguageService';
import { AdminAccountEntity } from '../../../../../../open-api-modules/dashboard-api-docs';
import {
  BNPL_STATUS,
  GPAY_REPAYMENT_STATUS,
} from '../../../../core/common/enum/bnpl';
import { PeriodTimesModel } from '../../../../public/models/external/periodTimes.model';
import UserStatusEnum = AdminAccountEntity.UserStatusEnum;

@Component({
  selector: 'app-pl-status-element',
  templateUrl: './pl-status-element.component.html',
  styleUrls: ['./pl-status-element.component.scss'],
})
export class PlStatusElementComponent implements OnInit, AfterViewInit {
  @ViewChild(PlStatusLabelComponent) child: PlStatusLabelComponent;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  _statusValue: any;

  _externalValue: any;

  _externalValue2: any;

  _statusType: DATA_STATUS_TYPE;

  @Input()
  get statusType(): DATA_STATUS_TYPE {
    return this._statusType;
  }

  set statusType(value: DATA_STATUS_TYPE) {
    this._statusType = value;
    this.dataStatus = this.getDataStatus();
  }

  @Input()
  get statusValue(): any {
    return this._statusValue;
  }

  set statusValue(value: any) {
    this._statusValue = value;
    this.dataStatus = this.getDataStatus();
  }

  @Input()
  get externalValue(): any {
    return this._externalValue;
  }

  set externalValue(value: any) {
    this._externalValue = value;
    this.dataStatus = this.getDataStatus();
  }

  @Input()
  get externalValue2(): any {
    return this._externalValue2;
  }

  set externalValue2(value: any) {
    this._externalValue2 = value;
    this.dataStatus = this.getDataStatus();
  }

  dataStatus: any;

  getDataStatus() {
    switch (this.statusType) {
      case DATA_STATUS_TYPE.PL_HMG_STATUS:
      case DATA_STATUS_TYPE.PL_TNG_STATUS:
        return this.loanStatusContent(
          this.statusValue,
          this.externalValue,
          this.externalValue2
        );
      case DATA_STATUS_TYPE.PL_VAC_STATUS:
        return this.loanStatusVACContent(this.statusValue, this.externalValue);
      case DATA_STATUS_TYPE.CUSTOMER_STATUS:
        return this.customerStatusContent(this.statusValue, this.externalValue);
      case DATA_STATUS_TYPE.PL_UI_STATUS:
        return this.loanUIStatusContent(this.statusValue);
      case DATA_STATUS_TYPE.PL_OTHER_STATUS:
        return this.loanOtherStatusContent(this.statusValue);
      case DATA_STATUS_TYPE.PL_REPAYMENT_STATUS:
        return this.loanRepaymentStatusContent(this.statusValue);
      case DATA_STATUS_TYPE.PL_DEBT_STATUS:
        return this.loanDebtStatusContent(this.statusValue);
      case DATA_STATUS_TYPE.PL_TERM_TYPE:
        return this.loanTermType(this.statusValue);
      case DATA_STATUS_TYPE.PL_RATING_STATUS:
        return this.loanRatingStatusContent(this.statusValue);
      case DATA_STATUS_TYPE.USER_STATUS:
        return this.userStatus(this.statusValue);
      case DATA_STATUS_TYPE.BNPL_STATUS:
        return this.bnplStatus(this.statusValue, this.externalValue);
      case DATA_STATUS_TYPE.GPAY_REPAYMENT_STATUS:
        return this.gpayStatus(this.statusValue);
      default:
        return {
          label: this.statusValue,
          labelStatus: this.statusType,
        };
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataStatus = this.getDataStatus();
    this.child.initStatusClasses();
    this.cdr.detectChanges();
  }

  customerStatusContent(isVerified, kalapaData) {
    if (isVerified) {
      return {
        label: this.multiLanguageService.instant(
          'customer.individual_info.customer_status.already_verified'
        ),
        labelStatus: PL_LABEL_STATUS.SUCCESS,
      };
    } else if (!isVerified && kalapaData?.createdAt) {
      return {
        label: this.multiLanguageService.instant(
          'customer.individual_info.customer_status.already_ekyc'
        ),
        labelStatus: PL_LABEL_STATUS.INFO,
      };
    } else if (!isVerified && !kalapaData?.createdAt) {
      return {
        label: this.multiLanguageService.instant(
          'customer.individual_info.customer_status.not_verified'
        ),
        labelStatus: PL_LABEL_STATUS.PENDING,
      };
    } else {
      return {
        label: status,
        labelStatus: PL_LABEL_STATUS.REJECT,
      };
    }
  }

  loanUIStatusContent(status) {
    switch (status) {
      case PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
      case PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.INFO,
        };
      case PAYDAY_LOAN_UI_STATUS.NOT_ACCEPTING_TERM_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DISBURSEMENT,
        };
      case PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_CDE_YET:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.pl_ui_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      default:
        return {
          label: status,
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }

  loanOtherStatusContent(status) {
    switch (status) {
      case this.multiLanguageService.instant(
        PAYDAY_LOAN_OTHER_STATUS.NOT_RECEIVED_SALARY_YET
      ):
        return {
          label: this.statusValue,
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case this.multiLanguageService.instant(
        PAYDAY_LOAN_OTHER_STATUS.RECEIVED_SALARY
      ):
        return {
          label: this.statusValue,
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case this.multiLanguageService.instant(
        PAYDAY_LOAN_OTHER_STATUS.ACTIVE_USER
      ):
        return {
          label: this.statusValue,
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case this.multiLanguageService.instant(
        PAYDAY_LOAN_OTHER_STATUS.INACTIVE_USER
      ):
        return {
          label: this.statusValue,
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case true:
        return {
          label: this.multiLanguageService.instant('common.success'),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case false:
        return {
          label: this.multiLanguageService.instant('common.failure'),
          labelStatus: PL_LABEL_STATUS.CANCEL,
        };
      default:
        return {
          label: 'N/A',
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }

  loanRatingStatusContent(status) {
    switch (status) {
      case PAYDAY_LOAN_RATING_STATUS.VERY_SATISFIED:
        return {
          label: this.multiLanguageService.instant(
            'loan_app.rating.very_satisfied'
          ),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case PAYDAY_LOAN_RATING_STATUS.SATISFIED:
        return {
          label: this.multiLanguageService.instant('loan_app.rating.satisfied'),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case PAYDAY_LOAN_RATING_STATUS.NORMAL:
        return {
          label: this.multiLanguageService.instant('loan_app.rating.normal'),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case PAYDAY_LOAN_RATING_STATUS.SEMI_SATISFIED:
        return {
          label: this.multiLanguageService.instant(
            'loan_app.rating.semi_satisfied'
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_RATING_STATUS.NOT_SATISFIED:
        return {
          label: this.multiLanguageService.instant(
            'loan_app.rating.not_satisfied'
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      default:
        return {
          label: 'N/A',
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }

  loanRepaymentStatusContent(status) {
    switch (status) {
      case PAYDAY_LOAN_REPAYMENT_STATUS.COMPLETED_PAID:
        return {
          label: this.multiLanguageService.instant('loan_app.loan_info.paid'),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case PAYDAY_LOAN_REPAYMENT_STATUS.OVERDUE:
        return {
          label: this.multiLanguageService.instant(
            'loan_app.loan_info.overdue'
          ),
          labelStatus: PL_LABEL_STATUS.CANCEL,
        };
      default:
        return {
          label: this.multiLanguageService.instant('loan_app.loan_info.unpaid'),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
    }
  }

  loanDebtStatusContent(status) {
    switch (status) {
      case true:
        return {
          label: this.multiLanguageService.instant(
            'payday_loan.repayment_status.bad_debt'
          ),
          labelStatus: PL_LABEL_STATUS.WORSE,
        };
      default:
        return 'N/A';
    }
  }

  loanTermType(status) {
    switch (status) {
      case TERM_TYPE.THREE_MONTH:
        return {
          label: this.multiLanguageService.instant(
            'payday_loan.term_type.three_month'
          ),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case TERM_TYPE.ONE_MONTH:
      default:
        return {
          label: this.multiLanguageService.instant(
            'payday_loan.term_type.one_month'
          ),
          labelStatus: PL_LABEL_STATUS.INFO,
        };
    }
  }

  loanStatusContent(
    status: string,
    repaymentStatus?: string,
    isBadLoan?: boolean
  ) {
    if (
      status &&
      status === PAYDAY_LOAN_STATUS.IN_REPAYMENT &&
      repaymentStatus
    ) {
      if (repaymentStatus === REPAYMENT_STATUS.OVERDUE && isBadLoan) {
        return {
          label: this.multiLanguageService.instant(
            'payday_loan.repayment_status.bad_debt'
          ),
          labelStatus: PL_LABEL_STATUS.WORSE,
        };
      } else if (repaymentStatus === REPAYMENT_STATUS.OVERDUE && !isBadLoan) {
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.repayment_status.${repaymentStatus.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CANCEL,
        };
      }
    }

    switch (status) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.INITIALIZED,
        };
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DOCUMENT_AWAITING,
        };
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DOCUMENTATION_COMPLETE,
        };
      case PAYDAY_LOAN_STATUS.AUCTION:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.AUCTION,
        };
      case PAYDAY_LOAN_STATUS.FUNDED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.FUNDED,
        };
      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CONTRACT_AWAITING,
        };
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CONTRACT_AWAITING,
        };
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.AWAITING_DISBURSEMENT,
        };
      case PAYDAY_LOAN_STATUS.DISBURSED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DISBURSED,
        };
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.IN_REPAYMENT,
        };
      case PAYDAY_LOAN_STATUS.COMPLETED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.COMPLETED,
        };
      case PAYDAY_LOAN_STATUS.REJECTED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.REJECTED,
        };
      case PAYDAY_LOAN_STATUS.CONTRACT_REJECTED:
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.WITHDRAW,
        };
      default:
        return {
          label: status,
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }

  loanStatusVACContent(status: string, repaymentStatus?: string) {
    if (
      status &&
      status === PAYDAY_LOAN_STATUS.IN_REPAYMENT &&
      repaymentStatus
    ) {
      switch (repaymentStatus) {
        case REPAYMENT_STATUS.OVERDUE:
          return {
            label: this.multiLanguageService.instant(
              `payday_loan.repayment_status.${repaymentStatus.toLowerCase()}`
            ),
            labelStatus: PL_LABEL_STATUS.CANCEL,
          };
        case DEBT_STATUS.BADDEBT:
          return {
            label: this.multiLanguageService.instant(
              `payday_loan.repayment_status.bad_debt`
            ),
            labelStatus: PL_LABEL_STATUS.WORSE,
          };
        default:
          break;
      }
    }

    switch (status) {
      case PAYDAY_LOAN_STATUS.INITIALIZED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.INITIALIZED,
        };
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.document_awaiting_vac`
          ),
          labelStatus: PL_LABEL_STATUS.DOCUMENT_AWAITING,
        };
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DOCUMENTATION_COMPLETE,
        };
      case PAYDAY_LOAN_STATUS.AUCTION:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.AUCTION,
        };
      case PAYDAY_LOAN_STATUS.FUNDED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.FUNDED,
        };
      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CONTRACT_AWAITING,
        };
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CONTRACT_AWAITING,
        };
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.AWAITING_DISBURSEMENT,
        };
      case PAYDAY_LOAN_STATUS.DISBURSED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DISBURSED,
        };
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.IN_REPAYMENT,
        };
      case PAYDAY_LOAN_STATUS.COMPLETED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.COMPLETED,
        };
      case PAYDAY_LOAN_STATUS.REJECTED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.REJECTED,
        };
      case PAYDAY_LOAN_STATUS.CONTRACT_REJECTED:
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.WITHDRAW,
        };
      default:
        return {
          label: status,
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }

  userStatus(status) {
    switch (status) {
      case UserStatusEnum.Locked:
      case 'INACTIVE':
        return {
          label: this.multiLanguageService.instant('common.inactive'),
          labelStatus: PL_LABEL_STATUS.WITHDRAW,
        };
      case UserStatusEnum.Active:
      default:
        return {
          label: this.multiLanguageService.instant('common.active'),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
    }
  }

  bnplStatus(status, periods: PeriodTimesModel) {
    let now = new Date();
    if (periods && status && status === BNPL_STATUS.DISBURSE) {
      if (
        (new Date(periods.periodTime2.convertedDueDate) < now &&
          !periods.periodTime2.complete) ||
        (new Date(periods.periodTime3.convertedDueDate) < now &&
          !periods.periodTime3.complete) ||
        (new Date(periods.periodTime4.convertedDueDate) < now &&
          !periods.periodTime4.complete)
      ) {
        return {
          label: this.multiLanguageService.instant(
            `bnpl.repayment_status.overdue`
          ),
          labelStatus: PL_LABEL_STATUS.CANCEL,
        };
      }

      if (periods.periodTime4?.complete) {
        return {
          label: this.multiLanguageService.instant(`bnpl.status.completed`),
          labelStatus: PL_LABEL_STATUS.IN_REPAYMENT,
        };
      }

      if (periods.periodTime3?.complete && !periods.periodTime4?.complete) {
        return {
          label: this.multiLanguageService.instant(
            `bnpl.repayment_status.payment_term_3`
          ),
          labelStatus: PL_LABEL_STATUS.IN_REPAYMENT,
        };
      }

      if (
        periods.periodTime2?.complete &&
        !periods.periodTime3?.complete &&
        !periods.periodTime4?.complete
      ) {
        return {
          label: this.multiLanguageService.instant(
            `bnpl.repayment_status.payment_term_2`
          ),
          labelStatus: PL_LABEL_STATUS.IN_REPAYMENT,
        };
      }

      if (
        !periods.periodTime2?.complete &&
        !periods.periodTime3?.complete &&
        !periods.periodTime4?.complete
      ) {
        return {
          label: this.multiLanguageService.instant(
            `bnpl.repayment_status.payment_term_1`
          ),
          labelStatus: PL_LABEL_STATUS.IN_REPAYMENT,
        };
      }
    }

    switch (status) {
      case BNPL_STATUS.PENDING:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case BNPL_STATUS.UNDOAPPROVAL:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CANCEL,
        };
      case BNPL_STATUS.APPROVE:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.FUNDED,
        };
      case BNPL_STATUS.CONTRACT_AWAITING:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CONTRACT_AWAITING,
        };
      case BNPL_STATUS.CONTRACT_ACCEPTED:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CONTRACT_AWAITING,
        };
      case BNPL_STATUS.DISBURSE:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DISBURSED,
        };
      case BNPL_STATUS.COMPLETED:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.COMPLETED,
        };
      case BNPL_STATUS.WITHDRAW:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.WITHDRAW,
        };
      default:
        return {
          label: status,
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }

  gpayStatus(status) {
    switch (status) {
      case GPAY_REPAYMENT_STATUS.ORDER_SUCCESS:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.gpay_repayment_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case GPAY_REPAYMENT_STATUS.ORDER_PENDING:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.gpay_repayment_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case GPAY_REPAYMENT_STATUS.ORDER_VERIFYING:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.gpay_repayment_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DOCUMENTATION_COMPLETE,
        };
      case GPAY_REPAYMENT_STATUS.ORDER_PROCESSING:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.gpay_repayment_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.AUCTION,
        };
      case GPAY_REPAYMENT_STATUS.ORDER_FAILED:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.gpay_repayment_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.WITHDRAW,
        };
      case GPAY_REPAYMENT_STATUS.ORDER_CANCEL:
        return {
          label: this.multiLanguageService.instant(
            `bnpl.gpay_repayment_status.${status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
      default:
        return {
          label: status,
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }
}
