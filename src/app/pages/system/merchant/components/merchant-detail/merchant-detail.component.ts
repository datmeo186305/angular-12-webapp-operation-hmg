import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../../core/common/enum/operator';
import { MatDialog } from '@angular/material/dialog';
import { Merchant } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { MERCHANT_SELL_TYPE_TEXT } from '../../../../../core/common/enum/bnpl';

@Component({
  selector: 'app-merchant-detail',
  templateUrl: './merchant-detail.component.html',
  styleUrls: ['./merchant-detail.component.scss'],
})
export class MerchantDetailComponent implements OnInit {
  _merchantInfo: Merchant;
  leftCompanyInfos: any[] = [];
  rightCompanyInfos: any[] = [];

  @Input()
  get merchantInfo(): Merchant {
    return this._merchantInfo;
  }

  set merchantInfo(value: Merchant) {
    this._merchantInfo = value;
    this.leftCompanyInfos = this._initLeftMerchantInfo();
    this.rightCompanyInfos = this._initRightMerchantInfo();
  }

  @Output() triggerUpdateInfo = new EventEmitter<any>();
  @Output() triggerDeleteMerchant = new EventEmitter<any>();
  @Output() triggerLockMerchant = new EventEmitter<any>();
  @Output() triggerUnlockMerchant = new EventEmitter<any>();
  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private dialog: MatDialog
  ) {}

  get status() {
    return this.merchantInfo?.status;
  }

  ngOnInit(): void {}

  // submitForm() {
  //   const data = this.merchantInfoForm.getRawValue();
  //   this.triggerUpdateInfo.emit({
  //     'personalData.note': data.note,
  //   });
  // }

  public openUpdateDialog() {
    this.triggerUpdateInfo.emit();
  }
  public lockPrompt() {
    this.triggerLockMerchant.emit();
  }

  public unlockPrompt() {
    this.triggerUnlockMerchant.emit();
  }

  public deletePrompt() {
    this.triggerDeleteMerchant.emit();
  }

  private _initLeftMerchantInfo() {
    return [
      {
        title: this.multiLanguageService.instant('merchant.merchant_detail.id'),
        value: this.merchantInfo?.code,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.name'
        ),
        value: this.merchantInfo?.name,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.location'
        ),
        value: this.merchantInfo?.address,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.merchant_fee'
        ),
        value: this.merchantInfo?.merchantServiceFee,
        type: DATA_CELL_TYPE.PERCENT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.customer_fee'
        ),
        value: this.merchantInfo?.customerServiceFee,
        type: DATA_CELL_TYPE.PERCENT,
        format: null,
      },
      // {
      //   title: this.multiLanguageService.instant(
      //     'merchant.merchant_detail.area'
      //   ),
      //   value: this.merchantInfo?.district,
      //   type: DATA_CELL_TYPE.TEXT,
      //   format: null,
      // },
      // {
      //   title: this.multiLanguageService.instant(
      //     'merchant.merchant_detail.commune'
      //   ),
      //   value: this.merchantInfo?.ward,
      //   type: DATA_CELL_TYPE.TEXT,
      //   format: null,
      // },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.manager'
        ),
        value: this.merchantInfo?.adminAccountEntity?.username,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.type'
        ),
        value: this.merchantSellType(this.merchantInfo?.merchantSellType),
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  private _initRightMerchantInfo() {
    return [
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.phone_number'
        ),
        value: this.merchantInfo?.mobile,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.email'
        ),
        value: this.merchantInfo?.email,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.website'
        ),
        value: this.merchantInfo?.website,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.regis_no'
        ),
        value: this.merchantInfo?.identificationNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.establish'
        ),
        value: this.merchantInfo?.establishTime,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.product'
        ),
        value: this.merchantInfo?.productTypes,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.status'
        ),
        value: this.merchantInfo?.status,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.USER_STATUS,
      },
    ];
  }

  merchantSellType(sellType) {
    if (!sellType) return null;
    return this.multiLanguageService.instant(MERCHANT_SELL_TYPE_TEXT[sellType]);
  }
}
