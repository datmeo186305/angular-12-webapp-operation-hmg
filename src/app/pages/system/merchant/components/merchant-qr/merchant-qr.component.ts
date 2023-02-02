import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DATA_CELL_TYPE } from '../../../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AdminAccountEntity,
  Merchant,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import {
  DialogEkycInfoDetailComponent,
  MerchantQrCodeDialogComponent,
} from '../../../../../share/components';

@Component({
  selector: 'app-merchant-qr',
  templateUrl: './merchant-qr.component.html',
  styleUrls: ['./merchant-qr.component.scss'],
})
export class MerchantQrComponent implements OnInit {
  _merchantInfo: Merchant;
  @Input()
  get merchantInfo(): Merchant {
    return this._merchantInfo;
  }

  set merchantInfo(value: Merchant) {
    this._merchantInfo = value;
    this.leftCompanyInfos = this._initLeftCompanyInfos();
  }

  _merchantQr;
  @Input()
  get merchantQr() {
    return this._merchantQr;
  }

  set merchantQr(value) {
    this._merchantQr = value;
  }

  leftCompanyInfos: any[] = [];

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.leftCompanyInfos = this._initLeftCompanyInfos();
  }

  private _initLeftCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.name'
        ),
        value: this.merchantInfo?.name,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('merchant.merchant_detail.id'),
        value: this.merchantInfo?.code,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  public printQr() {
    this.dialog.open(MerchantQrCodeDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '600px',
      width: '60%',
      data: {
        merchantInfo: this.merchantInfo,
        merchantQr: this._merchantQr,
      },
    });
  }
}
