import { NotificationService } from 'src/app/core/services/notification.service';
import { ApiResponseCheckIsPaydayByCustomerIdResponse } from '../../../../../../../open-api-modules/customer-api-docs';
import { TngControllerService } from '../../../../../../../open-api-modules/customer-api-docs';
import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  Bank,
  CustomerInfo,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { CompanyInfo } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { DialogCompanyInfoUpdateComponent } from '../dialog-company-info-update/dialog-company-info-update.component';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
} from '../../../../../core/common/enum/operator';
import { Subscription } from 'rxjs';
import { CustomerDetailService } from '../../../../../pages/customer/components/customer-detail-element/customer-detail.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-company-info',
  templateUrl: './customer-company-info.component.html',
  styleUrls: ['./customer-company-info.component.scss'],
})
export class CustomerCompanyInfoComponent implements OnInit, OnDestroy {
  @Input() customerId: string = '';
  @Input() bankOptions: Array<Bank>;
  @Input() companyOptions: Array<CompanyInfo>;
  @Input() disabledColumns: string[];
  @Input() hiddenColumns: string[];

  _customerInfo: CustomerInfo;
  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._customerInfo = value;
    this.leftCompanyInfos = this._initLeftCompanyInfos();
    this.rightCompanyInfos = this._initRightCompanyInfos();
  }

  @Output() triggerUpdateInfo = new EventEmitter<any>();

  isCanCheckSalary: boolean = false;

  leftCompanyInfos: any[] = [];
  rightCompanyInfos: any[] = [];

  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private customerDetailService: CustomerDetailService,
    private notifier: ToastrService,
    private tngControllerService: TngControllerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.customerInfo.companyInfo?.groupName === 'TNG') {
      this.isCanCheckSalary = true;
    }
  }

  private _initLeftCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.company_name'
        ),
        value: this.customerInfo.companyInfo?.name,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.employee_code'
        ),
        value: this.customerInfo.organizationName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'loan_app.company_info.working_time'
        ),
        value: this.customerInfo.borrowerEmploymentHistoryTextVariable1,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.full_name'
        ),
        value: this.customerInfo.firstName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.last_name'
        ),
        value: this.customerInfo.tngData?.hoDem,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.first_name'
        ),
        value: this.customerInfo.tngData?.ten,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.office_code'
        ),
        value: this.customerInfo.officeCode,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.office_name'
        ),
        value: this.customerInfo.officeName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  private _initRightCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.annual_income'
        ),
        value: this.customerInfo.annualIncome,
        type: DATA_CELL_TYPE.CURRENCY,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.working_days'
        ),
        value: this.customerInfo.workingDay,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.account_number'
        ),
        value: this.customerInfo.accountNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.bank_name'
        ),
        value: this.customerInfo.bankName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.bank_code'
        ),
        value: this.customerInfo.bankCode,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.company_info.received_date'
        ),
        value: this.customerInfo.tngData?.createdAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
    ];
  }

  openUpdateDialog() {
    const updateDialogRef = this.dialog.open(DialogCompanyInfoUpdateComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        customerInfo: this.customerInfo,
        customerId: this.customerId,
        bankOptions: this.bankOptions,
        companyOptions: this.companyOptions,
        disabledColumns: this.disabledColumns,
        hiddenColumns: this.hiddenColumns,
      },
    });

    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let updateInfoRequest = this._bindingDialogCompanyInfoData(
            result.data
          );
          this.triggerUpdateInfo.emit(updateInfoRequest);
        }
      })
    );
  }

  private _bindingDialogCompanyInfoData(data) {
    if (data.bankCode == "") {
      data.bankName = "";
    }
    return {
      'personalData.companyId': data?.companyId,
      'personalData.organizationName': data?.employeeCode,
      'personalData.borrowerEmploymentHistoryTextVariable1':
        data?.borrowerEmploymentHistoryTextVariable1,
      'personalData.firstName': data?.firstName,
      'tngData.ten': data?.tngFirstName || null,
      'tngData.hoDem': data?.tngLastName || null,
      'financialData.accountNumber': data?.accountNumber || null,
      'financialData.bankCode': data?.bankCode || null,
      'financialData.bankName': data?.bankName || null,
      'personalData.annualIncome': data?.annualIncome,
      'personalData.workingDay': data?.workingDay,
      'personalData.officeCode': data?.officeCode,
      'personalData.officeName': data?.officeName,
    };
  }

  public checkSalaryInfo() {
    this.subManager.add(
      this.tngControllerService
        .checkCustomerInformationSalaryReceiptDate(this.customerId)
        .subscribe((response: ApiResponseCheckIsPaydayByCustomerIdResponse) => {
          if (response && response.responseCode === 200) {
            let paydayNotification: string;
            let imgNotification: string;
            if (response.result.isPayday === 'false') {
              paydayNotification = this.multiLanguageService.instant(
                'loan_app.company_info.is_not_payday'
              );
              imgNotification =
                'assets/img/payday-loan/warning-prompt-icon.png';
            } else {
              paydayNotification = this.multiLanguageService.instant(
                'loan_app.company_info.is_payday'
              );
              imgNotification =
                'assets/img/payday-loan/success-prompt-icon.png';
            }

            this.notificationService.openPrompt({
              title: this.multiLanguageService.instant('common.error'),
              content: paydayNotification,
              imgUrl: imgNotification,
              primaryBtnText: this.multiLanguageService.instant('common.ok'),
            });
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
