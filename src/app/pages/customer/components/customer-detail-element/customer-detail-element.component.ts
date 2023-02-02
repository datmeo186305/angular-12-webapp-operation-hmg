import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ApiResponseCustomerInfo,
  ApiResponseSearchAndPaginationResponseBank,
  ApiResponseSearchAndPaginationResponseCompanyInfo,
  Bank,
  BankControllerService,
  CompanyControllerService,
  CompanyInfo,
  CustomerInfo,
} from '../../../../../../open-api-modules/dashboard-api-docs';

import { CustomerDetailService } from './customer-detail.service';
import { Subscription } from 'rxjs';
import { RESPONSE_CODE } from '../../../../core/common/enum/operator';
import { ToastrService } from 'ngx-toastr';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  CityControllerService,
  DistrictControllerService,
} from '../../../../../../open-api-modules/customer-api-docs';
import { PermissionConstants } from '../../../../core/common/constants/permission-constants';

@Component({
  selector: 'app-customer-detail-element',
  templateUrl: './customer-detail-element.component.html',
  styleUrls: ['./customer-detail-element.component.scss'],
})
export class CustomerDetailElementComponent implements OnInit, OnDestroy {
  _customerId: string;
  @Input()
  get customerId(): string {
    return this._customerId;
  }

  set customerId(value: string) {
    this._customerId = value;
  }

  @Output() updateElementInfo = new EventEmitter<CompanyInfo>();

  @Input() userInfo: CustomerInfo;
  @Input() bankOptions: Array<Bank>;
  @Input() companyOptions: Array<CompanyInfo>;
  hiddenColumns: string[] = [];
  disabledColumns: string[] = [];
  cityData: any[];
  districtData: any[];
  communeData: any[];

  subManager = new Subscription();

  listPermission = {
    getEKYCInfo: PermissionConstants.DASHBOARD_PERMISSION.GET_EKYC_INFO,
    getEkycInfoByCustomerId:
      PermissionConstants.DASHBOARD_PERMISSION
        .GET_LIST_EKYC_INFO_BY_CUSTOMER_ID,
  };

  constructor(
    private customerDetailService: CustomerDetailService,
    private cityControllerService: CityControllerService,
    private districtControllerService: DistrictControllerService,
    private bankControllerService: BankControllerService,
    private notifier: ToastrService,
    private companyControllerService: CompanyControllerService,
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  public refreshContent() {
    setTimeout(() => {
      this._getCustomerInfoById(this.customerId);
    }, 1000);
  }

  private _getCustomerInfoById(customerId) {
    if (!customerId) return;
    this.subManager.add(
      this.customerDetailService
        .getById(customerId)
        .subscribe((data: ApiResponseCustomerInfo) => {
          this.userInfo = data?.result;
          this.updateElementInfo.emit(this.userInfo);
        })
    );
  }

  private _getBankOptions() {
    this.subManager.add(
      this.bankControllerService
        .getBanks(200, 0, {})
        .subscribe((response: ApiResponseSearchAndPaginationResponseBank) => {
          if (response.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
            return;
          }
          this.bankOptions = response?.result?.data;
        })
    );
  }

  private _getCompanyList() {
    this.subManager.add(
      this.companyControllerService
        .getCompanies(100, 0, {})
        .subscribe(
          (data: ApiResponseSearchAndPaginationResponseCompanyInfo) => {
            this.companyOptions = data?.result?.data;
          }
        )
    );
  }

  public updateCustomerInfo(updateInfoRequest: Object) {
    if (!updateInfoRequest) {
      this.refreshContent();
      return;
    }
    this.notificationService.showLoading({ showContent: true });
    this.subManager.add(
      this.customerDetailService
        .updateCustomerInfo(this.customerId, updateInfoRequest, null, true)
        .subscribe(
          (result) => {
            if (result?.responseCode !== RESPONSE_CODE.SUCCESS) {
              this.notificationService.hideLoading();
              this.notifier.error(
                JSON.stringify(result?.message),
                result?.errorCode
              );
              return;
            }

            setTimeout(() => {
              this.notifier.success(
                this.multiLanguageService.instant('common.update_success')
              );
              this.refreshContent();
              this.notificationService.hideLoading();
            }, 3000);
          },
          (error) => {
            this.notifier.error(JSON.stringify(error));
            this.notificationService.hideLoading();
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
