import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';
import {
  BNPL_PAYMENT_TYPE,
  BNPL_PERIOD,
  BNPL_STATUS,
} from '../../../../../core/common/enum/bnpl';
import { PeriodTimesModel } from '../../../../../public/models/external/periodTimes.model';
import {
  BnplApplication,
  PeriodTime,
} from '../../../../../../../open-api-modules/dashboard-api-docs';

@Component({
  selector: 'app-bnpl-payment-dialog',
  templateUrl: './bnpl-payment-dialog.component.html',
  styleUrls: ['./bnpl-payment-dialog.component.scss'],
})
export class BnplPaymentDialogComponent implements OnInit {
  bnplPaymentForm: FormGroup;
  periodOptions: any[] = [];
  periodTimes: PeriodTimesModel;
  loanInfo: BnplApplication;
  dialogTitle: string;
  @ViewChild('amount') amountInputRef: ElementRef<HTMLInputElement>;

  constructor(
    private dialogRef: MatDialogRef<BnplPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder
  ) {
    this.dialogTitle = this.multiLanguageService.instant(
      'bnpl.loan_info.payment.repayment_period'
    );
    this.buildBnplPaymentForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {
    this.formatAnnualIncomeInputWithSeparator();
  }

  submitForm() {
    this.bnplPaymentForm.markAllAsTouched();

    if (this.bnplPaymentForm.invalid) {
      return;
    }
    if (this.bnplPaymentForm.controls.amount.value) {
      this.convertAnnualIncomeInputWithoutSeparator();
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.bnplPaymentForm.getRawValue(),
    });
  }

  buildBnplPaymentForm() {
    this.bnplPaymentForm = this.formBuilder.group({
      amount: [''],
      period: [''],
    });
  }

  initDialogData(data: any) {
    this.periodTimes = data.periodTimes;
    this.loanInfo = data.loanInfo;
    this.initPeriodOptions();

    if (data.type === BNPL_PAYMENT_TYPE.ALL_PERIOD) {
      this.bnplPaymentForm.controls.period.setValue(BNPL_PERIOD.PERIOD_TIME_4);
      this.changePeriod(BNPL_PERIOD.PERIOD_TIME_4);
    } else {
      this.initFormData();
    }
    if (
      this.bnplPaymentForm.controls.period.value === BNPL_PERIOD.PERIOD_TIME_4
    ) {
      this.dialogTitle = this.multiLanguageService.instant(
        'bnpl.loan_info.payment.all_period'
      );

      this.bnplPaymentForm.controls['period'].disable();
    }
  }

  private initPeriodOptions() {
    this.periodOptions = [];

    if (this.loanInfo?.status !== BNPL_STATUS.DISBURSE) {
      this.periodOptions.push({
        value: BNPL_PERIOD.PERIOD_TIME_1,
        name: this.multiLanguageService.instant(
          'bnpl.loan_info.payment.period_time_1'
        ),
      });
    }

    if (!this.periodTimes?.periodTime2?.complete) {
      this.periodOptions.push({
        value: BNPL_PERIOD.PERIOD_TIME_2,
        name: this.multiLanguageService.instant(
          'bnpl.loan_info.payment.period_time_2'
        ),
      });
    }

    if (!this.periodTimes?.periodTime3?.complete) {
      this.periodOptions.push({
        value: BNPL_PERIOD.PERIOD_TIME_3,
        name: this.multiLanguageService.instant(
          'bnpl.loan_info.payment.period_time_3'
        ),
      });
    }

    if (!this.periodTimes?.periodTime4?.complete) {
      this.periodOptions.push({
        value: BNPL_PERIOD.PERIOD_TIME_4,
        name: this.multiLanguageService.instant(
          'bnpl.loan_info.payment.period_time_4'
        ),
      });
    }
  }

  private initFormData() {
    if (
      !this.periodTimes?.periodTime4?.complete &&
      this.periodTimes?.periodTime3?.complete &&
      this.periodTimes?.periodTime2?.complete &&
      this.loanInfo?.status == BNPL_STATUS.DISBURSE
    ) {
      this.changePeriod(BNPL_PERIOD.PERIOD_TIME_4);
      this.bnplPaymentForm.controls.period.setValue(BNPL_PERIOD.PERIOD_TIME_4);
      return;
    }

    if (
      !this.periodTimes?.periodTime3?.complete &&
      this.periodTimes?.periodTime2?.complete &&
      this.loanInfo?.status == BNPL_STATUS.DISBURSE
    ) {
      this.changePeriod(BNPL_PERIOD.PERIOD_TIME_3);
      this.bnplPaymentForm.controls.period.setValue(BNPL_PERIOD.PERIOD_TIME_3);
      return;
    }

    if (
      !this.periodTimes?.periodTime2?.complete &&
      this.loanInfo?.status == BNPL_STATUS.DISBURSE
    ) {
      this.changePeriod(BNPL_PERIOD.PERIOD_TIME_2);
      this.bnplPaymentForm.controls.period.setValue(BNPL_PERIOD.PERIOD_TIME_2);
      return;
    }

    if (this.loanInfo?.status !== BNPL_STATUS.DISBURSE) {
      this.changePeriod(BNPL_PERIOD.PERIOD_TIME_1);
      this.bnplPaymentForm.controls.period.setValue(BNPL_PERIOD.PERIOD_TIME_1);
      return;
    }
  }

  formatAnnualIncomeInputWithSeparator() {
    if (!this.bnplPaymentForm.controls.amount.value) {
      return null;
    }
    let numberValWithSeparator = parseInt(
      this.bnplPaymentForm.controls.amount.value
    ).toLocaleString('de-de');
    this.bnplPaymentForm.controls.amount.setValue(numberValWithSeparator);
  }

  convertAnnualIncomeInputWithoutSeparator() {
    if (
      !this.bnplPaymentForm.controls.amount.value ||
      typeof this.bnplPaymentForm.controls.amount.value !== 'string'
    ) {
      return null;
    }

    let numberVal = this.bnplPaymentForm.controls.amount.value.replace(
      /\D/g,
      ''
    );
    this.bnplPaymentForm.controls.amount.setValue(numberVal);
  }

  changePeriod(period) {
    let remainingPeriodTime1Amount = this.calcRemainingAmountOfPeriod(
      this.periodTimes?.periodTime1
    );

    let remainingPeriodTime2Amount = this.calcRemainingAmountOfPeriod(
      this.periodTimes?.periodTime2
    );

    let remainingPeriodTime3Amount = this.calcRemainingAmountOfPeriod(
      this.periodTimes?.periodTime3
    );

    let remainingPeriodTime4Amount = this.calcRemainingAmountOfPeriod(
      this.periodTimes?.periodTime4
    );

    switch (period) {
      case BNPL_PERIOD.PERIOD_TIME_1:
        this.bnplPaymentForm.controls.amount.setValue(
          remainingPeriodTime1Amount
        );
        break;
      case BNPL_PERIOD.PERIOD_TIME_2:
        this.bnplPaymentForm.controls.amount.setValue(
          remainingPeriodTime1Amount + remainingPeriodTime2Amount
        );
        break;
      case BNPL_PERIOD.PERIOD_TIME_3:
        this.bnplPaymentForm.controls.amount.setValue(
          remainingPeriodTime1Amount +
            remainingPeriodTime2Amount +
            remainingPeriodTime3Amount
        );
        break;
      case BNPL_PERIOD.PERIOD_TIME_4:
        this.bnplPaymentForm.controls.amount.setValue(
          remainingPeriodTime1Amount +
            remainingPeriodTime2Amount +
            remainingPeriodTime3Amount +
            remainingPeriodTime4Amount
        );
        break;
      default:
        break;
    }
    if (this.amountInputRef) {
      this.amountInputRef.nativeElement.focus();
    }
  }

  calcRemainingAmountOfPeriod(periodTime: PeriodTime) {
    if (!periodTime) return null;
    // DISBURSE is completed periodTime1
    if (!periodTime.period) {
      return this.loanInfo?.status === BNPL_STATUS.DISBURSE
        ? 0
        : periodTime.totalOriginalDueForPeriod;
    }
    return periodTime.complete ? 0 : periodTime.totalInstallmentAmountForPeriod;
  }
}
