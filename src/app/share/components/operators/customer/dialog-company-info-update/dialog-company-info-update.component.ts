import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Bank,
  CompanyInfo,
  CustomerInfo,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-company-info-update',
  templateUrl: './dialog-company-info-update.component.html',
  styleUrls: ['./dialog-company-info-update.component.scss'],
})
export class DialogCompanyInfoUpdateComponent implements OnInit {
  disabledColumns: string[];
  hiddenColumns: string[];
  customerInfo: CustomerInfo = {};
  banksFilterCtrl: FormControl = new FormControl();
  filteredBanks: any[];
  bankOptions: Array<Bank>;
  companyOptions: Array<CompanyInfo>;
  customerId: string;
  _onDestroy = new Subject<void>();

  bankNA = { bankCode: '', bankName: 'N/A' };

  workingTimeOptions: any[] = [
    'Dưới 6 tháng',
    '6 tháng đến dưới 1 năm',
    '1 năm đến dưới 2 năm',
    '2 năm đến 3 năm',
    'Trên 3 năm',
  ];

  companyInfoForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogCompanyInfoUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder
  ) {
    this.buildCompanyInfoForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {
    this.formatAnnualIncomeInputWithSeparator();
    this.banksFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  buildCompanyInfoForm() {
    this.companyInfoForm = this.formBuilder.group({
      companyId: [''],
      employeeCode: ['', [Validators.maxLength(50)]],
      borrowerEmploymentHistoryTextVariable1: [''],
      firstName: ['', [Validators.maxLength(256)]],
      tngFirstName: ['', [Validators.maxLength(256)]],
      tngLastName: ['', [Validators.maxLength(256)]],
      officeCode: ['', [Validators.maxLength(50)]],
      officeName: ['', [Validators.maxLength(50)]],
      annualIncome: ['', [Validators.max(1000000000)]],
      workingDay: ['', [Validators.maxLength(30)]],
      accountNumber: [''],
      bankCode: ['', [Validators.maxLength(50)]],
      bankName: ['', [Validators.maxLength(256)]],
    });
  }

  initDialogData(data: any) {
    this.customerInfo = data?.customerInfo;
    this.customerId = data?.customerId;
    this.bankOptions = data?.bankOptions ? data?.bankOptions : [];
    this.filteredBanks = data?.bankOptions ? data?.bankOptions : [];
    this.companyOptions = data?.companyOptions ? data?.companyOptions : [];
    this.disabledColumns = data?.disabledColumns ? data?.disabledColumns : [];
    this.hiddenColumns = data?.hiddenColumns ? data?.hiddenColumns : [];

    this.companyInfoForm.patchValue({
      companyId: this.customerInfo.companyId,
      employeeCode: this.customerInfo.organizationName,
      borrowerEmploymentHistoryTextVariable1:
        this.customerInfo?.borrowerEmploymentHistoryTextVariable1 || '',
      firstName: this.customerInfo.firstName,
      tngFirstName: this.customerInfo.tngData?.ten,
      tngLastName: this.customerInfo.tngData?.hoDem,
      officeCode: this.customerInfo.officeCode,
      officeName: this.customerInfo.officeName,
      annualIncome: this.customerInfo.annualIncome,
      workingDay: this.customerInfo.workingDay,
      accountNumber: this.customerInfo.accountNumber,
      bankCode: this.customerInfo?.bankCode || '',
      bankName: this.customerInfo?.bankName || '',
    });
  }

  changeBank(event) {
    if (!event.value) {
      return;
    }
    let seletedBank = this.bankOptions.filter(
      (bank) => bank.bankCode === event.value
    );
    if (!seletedBank) return;
    this.companyInfoForm.controls.bankName.setValue(seletedBank[0].bankName);
  }

  filterBanks() {
    let search = this.banksFilterCtrl.value;
    if (!search) {
      this.filteredBanks = this.bankOptions;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanks = this.bankOptions.filter(
      (bank) =>
        bank.bankCode.toLowerCase().indexOf(search) > -1 ||
        bank.bankName.toLowerCase().indexOf(search) > -1
    );
  }

  submitForm() {
    this.companyInfoForm.markAllAsTouched();

    if (this.companyInfoForm.invalid) {
      return;
    }
    if (this.companyInfoForm.controls.annualIncome.value) {
      this.convertAnnualIncomeInputWithoutSeparator();
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.companyInfoForm.getRawValue(),
    });
  }

  formatAnnualIncomeInputWithSeparator() {
    if (!this.companyInfoForm.controls.annualIncome.value) {
      return null;
    }

    let numberValWithSeparator = parseInt(
      this.companyInfoForm.controls.annualIncome.value
    ).toLocaleString('de-de');
    this.companyInfoForm.controls.annualIncome.setValue(numberValWithSeparator);
  }

  convertAnnualIncomeInputWithoutSeparator() {
    if (!this.companyInfoForm.controls.annualIncome.value) {
      return null;
    }

    let numberVal = this.companyInfoForm.controls.annualIncome.value.replace(
      /\D/g,
      ''
    );
    this.companyInfoForm.controls.annualIncome.setValue(numberVal);
  }
}
