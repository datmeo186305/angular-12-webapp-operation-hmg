import { Component, Input, OnInit } from '@angular/core';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from '../../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { CustomerDetailService } from '../../../../customer/components/customer-detail-element/customer-detail.service';
import {
  ApiResponseCustomerInfo,
  CustomerInfo,
  PaydayLoanTng,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import {
  DOCUMENT_TYPE,
  PAYDAY_LOAN_STATUS,
} from '../../../../../core/common/enum/payday-loan';
import { Subscription } from 'rxjs';
import { UpdatedDocumentModel } from '../../../../../public/models/external/updated-document.model';
import { DOCUMENT_BTN_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-compare-info-verification',
  templateUrl: './compare-info-verification.component.html',
  styleUrls: ['./compare-info-verification.component.scss'],
})
export class CompareInfoVerificationComponent implements OnInit {
  @Input() loanId: string;
  @Input() customerId: string;

  _loanDetail: PaydayLoanTng;
  @Input() get loanDetail(): PaydayLoanTng {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoanTng) {
    this._loanDetail = value;
    this.initInfoVerificationFormData();
  }

  hiddenUploadBtn: boolean = true;
  hiddenDeleteBtn: boolean = true;
  hiddenUpdateBtn: boolean = true;
  hiddenDownloadBtn: boolean = false;
  documentTypes = DOCUMENT_TYPE;

  customerInfo: CustomerInfo;

  customerProvideInfos = [
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.customer_name'
      ),
      key: 'name',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.phone_number'
      ),
      key: 'mobile',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.identity_number_one'
      ),
      key: 'identityNumber',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.start_working_day'
      ),
      key: 'startWorkingDay',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.contract_type'
      ),
      key: 'contractType',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.current_job'
      ),
      key: 'job',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.current_address'
      ),
      key: 'address',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.workdays'
      ),
      key: 'numberOfWorkDays',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.bank_code'
      ),
      key: 'bankCode',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.bank_name'
      ),
      key: 'bankName',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.account_number'
      ),
      key: 'accountNumber',
      value: null,
      highlight: false,
    },
  ];

  hrProvideInfos = [
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.customer_name'
      ),
      key: 'name',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.phone_number'
      ),
      key: 'mobile',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.identity_number_one'
      ),
      key: 'identityNumber',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.start_working_day'
      ),
      key: 'startWorkingDay',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.contract_type'
      ),
      key: 'contractType',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.current_job'
      ),
      key: 'job',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.current_address'
      ),
      key: 'address',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.workdays'
      ),
      key: 'numberOfWorkDays',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.bank_code'
      ),
      key: 'bankCode',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.bank_name'
      ),
      key: 'bankName',
      value: null,
      highlight: false,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.info_verification.account_number'
      ),
      key: 'accountNumber',
      value: null,
      highlight: false,
    },
  ];

  subManager = new Subscription();

  salary1Src: any;
  salary2Src: any;
  salary3Src: any;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private notifier: ToastrService,
    private permissionsService: NgxPermissionsService,
    private customerDetailService: CustomerDetailService
  ) {}

  ngOnInit(): void {
    this._getCustomerInfoById(this.customerId);
  }

  private _getSingleFileDocumentByPath(
    customerId: string,
    documentPath: string,
    documentType: DOCUMENT_TYPE
  ) {
    if (!customerId || !documentPath || !documentType) {
      return;
    }
    this.subManager.add(
      this.customerDetailService
        .downloadSingleFileDocument(customerId, documentPath)
        .subscribe((data) => {
          this._mapDocumentSrc(data, documentType);
        })
    );
  }

  private _mapDocumentSrc(data: any, documentType: DOCUMENT_TYPE) {
    switch (documentType) {
      case DOCUMENT_TYPE.SALARY_INFORMATION_ONE:
        this.salary1Src = data;
        break;
      case DOCUMENT_TYPE.SALARY_INFORMATION_TWO:
        this.salary2Src = data;
        break;
      case DOCUMENT_TYPE.SALARY_INFORMATION_THREE:
        this.salary3Src = data;
        break;
      default:
        break;
    }
  }

  private _getCustomerInfoById(customerId) {
    if (!customerId) return;
    this.subManager.add(
      this.customerDetailService
        .getById(customerId)
        .subscribe((data: ApiResponseCustomerInfo) => {
          this.customerInfo = data?.result;
          this.initInfoVerificationFormData();
        })
    );
  }

  public onChangeDocument(
    updatedDocumentModel: UpdatedDocumentModel,
    documentPath: string,
    documentType: DOCUMENT_TYPE
  ) {
    switch (updatedDocumentModel.type) {
      case DOCUMENT_BTN_TYPE.DOWNLOAD:
        this._downloadDocumentByPath(documentPath);
        break;
      default:
        break;
    }
  }

  private _downloadDocumentByPath(documentPath) {
    this.notifier.info(
      this.multiLanguageService.instant('common.process_downloading')
    );
    this.subManager.add(
      this.customerDetailService
        .downloadFileDocument(this.customerInfo.id, documentPath)
        .subscribe((result) => {})
    );
  }

  private initInfoVerificationFormData() {
    if (
      this.loanDetail?.status !== PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING &&
      this.loanDetail?.status !== PAYDAY_LOAN_STATUS.INITIALIZED &&
      this.loanDetail?.status !== PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
    ) {
      this._getSingleFileDocumentByPath(
        this.loanDetail?.customerId,
        this.loanDetail?.employeeData?.salaryDocument1,
        DOCUMENT_TYPE.SALARY_INFORMATION_ONE
      );
      this._getSingleFileDocumentByPath(
        this.loanDetail?.customerId,
        this.loanDetail?.employeeData?.salaryDocument2,
        DOCUMENT_TYPE.SALARY_INFORMATION_TWO
      );
      this._getSingleFileDocumentByPath(
        this.loanDetail?.customerId,
        this.loanDetail?.employeeData?.salaryDocument3,
        DOCUMENT_TYPE.SALARY_INFORMATION_THREE
      );
    }

    this.customerProvideInfos.forEach((field) => {
      switch (field.key) {
        case 'name':
          field.value =
            this.loanDetail?.transactionHistory?.personalData?.firstName ||
            this.customerInfo?.firstName;
          break;
        case 'mobile':
          field.value =
            this.loanDetail?.transactionHistory?.personalData?.mobileNumber ||
            this.customerInfo?.mobileNumber;
          break;
        case 'identityNumber':
          field.value =
            this.loanDetail?.transactionHistory?.personalData
              ?.identityNumberOne || this.customerInfo?.identityNumberOne;
          break;
        case 'startWorkingDay':
          field.value =
            this.loanDetail?.transactionHistory?.employeeData
              ?.startWorkingDay ||
            this.customerInfo?.employeeData?.startWorkingDay;
          break;
        case 'contractType':
          field.value =
            this.loanDetail?.transactionHistory?.financialData?.contractType ||
            this.customerInfo?.contractType;
          break;
        case 'job':
          field.value =
            this.loanDetail?.transactionHistory?.employeeData?.jobPosition ||
            this.customerInfo?.employeeData?.jobPosition;
          break;
        case 'address':
          field.value =
            this.loanDetail?.transactionHistory?.personalData
              ?.addressOneLine1 || this.customerInfo?.addressOneLine1;
          break;
        case 'numberOfWorkDays':
          field.value =
            this.loanDetail?.transactionHistory?.employeeData
              ?.numberOfWorkDays ||
            this.customerInfo?.employeeData?.numberOfWorkDays;
          break;
        case 'bankCode':
          field.value =
            this.loanDetail?.transactionHistory?.financialData?.bankCode ||
            this.customerInfo?.bankCode;
          break;
        case 'bankName':
          field.value =
            this.loanDetail?.transactionHistory?.financialData?.bankName ||
            this.customerInfo?.bankName;
          break;
        case 'accountNumber':
          field.value =
            this.loanDetail?.transactionHistory?.financialData?.accountNumber ||
            this.customerInfo?.accountNumber;
          break;
        default:
          break;
      }
    });

    this.hrProvideInfos.forEach((field) => {
      switch (field.key) {
        case 'name':
          field.value = this.loanDetail?.employeeData?.name;
          this.checkDifferentValue(field);
          break;
        case 'mobile':
          field.value = this.loanDetail?.employeeData?.mobile;
          this.checkDifferentValue(field);
          break;
        case 'identityNumber':
          field.value = this.loanDetail?.employeeData?.identityNumber;
          this.checkDifferentValue(field);
          break;
        case 'startWorkingDay':
          field.value = this.loanDetail?.employeeData?.startWorkingDay;
          this.checkDifferentValue(field);
          break;
        case 'contractType':
          field.value = this.loanDetail?.employeeData?.contractType;
          this.checkDifferentValue(field);
          break;
        case 'job':
          field.value = this.loanDetail?.employeeData?.job;
          this.checkDifferentValue(field);
          break;
        case 'address':
          field.value = this.loanDetail?.employeeData?.address;
          this.checkDifferentValue(field);
          break;
        case 'numberOfWorkDays':
          field.value = this.loanDetail?.employeeData?.numberOfWorkDays;
          this.checkDifferentValue(field);
          break;
        case 'bankCode':
          field.value = this.loanDetail?.employeeData?.bankCode;
          this.checkDifferentValue(field);
          break;
        case 'bankName':
          field.value = this.loanDetail?.employeeData?.bankName;
          this.checkDifferentValue(field);
          break;
        case 'accountNumber':
          field.value = this.loanDetail?.employeeData?.accountNumber;
          this.checkDifferentValue(field);
          break;
        default:
          break;
      }
    });
  }

  checkDifferentValue(hrField) {
    this.customerProvideInfos.forEach((customerField) => {
      if (customerField.key === hrField.key) {
        if (customerField.value !== hrField.value) {
          hrField.highlight = true;
          customerField.highlight = true;
        } else {
          hrField.highlight = false;
          customerField.highlight = false;
        }
      }
    });
  }
}
