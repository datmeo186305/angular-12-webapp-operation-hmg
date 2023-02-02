import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  BnplApplication,
  CustomerInfo,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { BnplListService } from '../../bnpl-list/bnpl-list.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  BUTTON_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import { NotificationService } from '../../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { BnplPaymentDialogComponent } from '../bnpl-payment-dialog/bnpl-payment-dialog.component';

@Component({
  selector: 'app-bnpl-element',
  templateUrl: './bnpl-element.component.html',
  styleUrls: ['./bnpl-element.component.scss'],
})
export class BnplElementComponent implements OnInit {
  @Input() loanDetail: BnplApplication;
  @Input() userInfo: CustomerInfo;
  @Output() loanDetailTriggerUpdateStatus = new EventEmitter<any>();
  @Output() onRefreshTrigger = new EventEmitter<any>();
  subManager = new Subscription();
  constructor(
    private multiLanguageService: MultiLanguageService,
    private bnplListService: BnplListService,
    private notifier: ToastrService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  public triggerUpdateLoanInfo(params) {
    let requestBody = {};
    if (params.note) {
      requestBody['note'] = params.note;
    }
    this.subManager.add(
      this.bnplListService
        .updateBnplApplication(this.loanDetail?.id, requestBody)
        .subscribe((response) => {
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
          this.loanDetailTriggerUpdateStatus.emit(response?.result);
        })
    );
  }

  public changeStatusBnplApplication(event) {
    const currentLoanStatusDisplay = this.multiLanguageService.instant(
      `bnpl.status.${this.loanDetail?.status.toLowerCase()}`
    );

    const newStatusDisplay = this.multiLanguageService.instant(
      `bnpl.status.${event.status.toLowerCase()}`
    );

    const confirmChangeStatusRef = this.notificationService.openPrompt({
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
      title: this.multiLanguageService.instant('common.are_you_sure'),
      content: this.multiLanguageService.instant(
        'bnpl.loan_info.confirm_change_status_description',
        {
          loan_code: this.loanDetail?.loanCode,
          current_loan_status: currentLoanStatusDisplay,
          new_loan_status: newStatusDisplay,
        }
      ),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
      primaryBtnClass: 'btn-accent',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmChangeStatusRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.bnplListService
            .changeStatusBnplApplication(event?.id, { status: event.status })
            .subscribe((result) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              setTimeout(() => {
                this.notifier.success(
                  this.multiLanguageService.instant(
                    'bnpl.loan_info.change_status_success'
                  )
                );
                this.getBnplById();
              }, 3000);
            })
        );
      }
    });
  }

  public repaymentBnplApplication({ id, type }) {
    const confirmRepaymentRef = this.dialog.open(BnplPaymentDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        type: type,
        loanInfo: this.loanDetail,
        periodTimes: {
          periodTime1: this.loanDetail?.periodTime1,
          periodTime2: this.loanDetail?.periodTime2,
          periodTime3: this.loanDetail?.periodTime3,
          periodTime4: this.loanDetail?.periodTime4,
        },
      },
    });
    confirmRepaymentRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (result.type === BUTTON_TYPE.PRIMARY) {
        this.updatePaymentOrder({ id, transactionAmount: result.data.amount });
      }
    });
  }

  public updatePaymentOrder({ id, transactionAmount }) {
    this.notificationService.showLoading({ showContent: true });
    this.subManager.add(
      this.bnplListService
        .repaymentBnplApplication(id, transactionAmount, null, true)
        .subscribe(
          (response) => {
            if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
              this.notificationService.hideLoading();
              return this.notifier.error(
                JSON.stringify(response?.message),
                response?.errorCode
              );
            }
            setTimeout(() => {
              this.notifier.success(
                this.multiLanguageService.instant(
                  'bnpl.loan_info.repayment_success'
                )
              );
              this.notificationService.hideLoading();
              this.onRefreshTrigger.emit();
            }, 5000);
          },
          (error) => {
            this.notifier.error(JSON.stringify(error));
            this.notificationService.hideLoading();
          }
        )
    );
  }

  public getBnplById() {
    this.subManager.add(
      this.bnplListService
        .getBnplById(this.loanDetail?.id)
        .subscribe((response) => {
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
          this.loanDetailTriggerUpdateStatus.emit(response?.result);
        })
    );
  }
}
